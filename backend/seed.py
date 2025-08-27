import os
import sys
import uuid
from datetime import datetime, timedelta
import random
from passlib.hash import pbkdf2_sha256

from flask import Flask
from app import create_app
from extensions import db
from models.user import User, Role
from models.doctor_profile import DoctorProfile, VerificationStatus
from models.clinic import Clinic, ClinicDoctor
from models.time_slot import TimeSlot, SlotType, RecurrencePattern
from models.appointment import Appointment, AppointmentStatus
from models.admin_settings import AdminSettings

def seed_database():
    """Seed the database with initial data"""
    print("Seeding database...")
    
    # Create admin user
    admin = User(
        email="admin@carebridge.com",
        password="admin123",
        first_name="Admin",
        last_name="User",
        role=Role.ADMIN,
        is_active=True,
        is_verified=True
    )
    db.session.add(admin)
    
    # Create clinic admin and clinic
    clinic_admin = User(
        email="clinic_admin@carebridge.com",
        password="clinic123",
        first_name="Clinic",
        last_name="Admin",
        role=Role.CLINIC_ADMIN,
        is_active=True,
        is_verified=True
    )
    db.session.add(clinic_admin)
    
    # Commit to get IDs
    db.session.commit()
    
    # Create clinic
    clinic = Clinic(
        name="CareBridge Medical Center",
        address="123 Health Street",
        city="Medical City",
        state="Health State",
        country="United States",
        postal_code="12345",
        phone="+1-555-123-4567",
        email="info@carebridge-clinic.com",
        website="https://carebridge-clinic.com",
        description="A state-of-the-art medical facility providing comprehensive healthcare services.",
        admin_id=clinic_admin.id
    )
    db.session.add(clinic)
    
    # Create doctors
    specialties = ["Cardiology", "Dermatology", "Neurology"]
    languages = ["English", "Spanish", "French", "German", "Chinese"]
    
    doctors = []
    for i in range(3):
        doctor = User(
            email=f"doctor{i+1}@carebridge.com",
            password=f"doctor{i+1}",
            first_name=f"Doctor{i+1}",
            last_name=f"Smith",
            role=Role.DOCTOR,
            is_active=True,
            is_verified=True
        )
        db.session.add(doctor)
        doctors.append(doctor)
    
    # Commit to get IDs
    db.session.commit()
    
    # Create doctor profiles
    for i, doctor in enumerate(doctors):
        doctor_profile = DoctorProfile(
            user_id=doctor.id,
            specialty=specialties[i],
            license_number=f"LIC{100000+i}",
            verification_status=VerificationStatus.APPROVED if i < 2 else VerificationStatus.PENDING,
            verification_date=datetime.utcnow() if i < 2 else None,
            verified_by=admin.id if i < 2 else None,
            bio=f"Experienced {specialties[i]} specialist with over {5+i*2} years of practice.",
            education="M.D. from Medical University",
            experience_years=5+i*2,
            languages=",".join(random.sample(languages, 2)),
            consultation_fee=50.00 + i*10,
            available_for_appointments=True
        )
        db.session.add(doctor_profile)
        
        # Associate doctor with clinic
        clinic_doctor = ClinicDoctor(
            clinic_id=clinic.id,
            doctor_id=doctor_profile.id,
            is_primary=True,
            start_date=datetime.utcnow().date() - timedelta(days=30*i)
        )
        db.session.add(clinic_doctor)
    
    # Create patients
    patients = []
    for i in range(5):
        patient = User(
            email=f"patient{i+1}@example.com",
            password=f"patient{i+1}",
            first_name=f"Patient{i+1}",
            last_name=f"Johnson",
            role=Role.PATIENT,
            is_active=True,
            is_verified=True,
            date_of_birth=datetime.utcnow().date() - timedelta(days=365*25) - timedelta(days=i*500)
        )
        db.session.add(patient)
        patients.append(patient)
    
    # Commit to get IDs
    db.session.commit()
    
    # Create time slots for the next 14 days
    now = datetime.utcnow()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    for doctor in doctors:
        doctor_profile = DoctorProfile.query.filter_by(user_id=doctor.id).first()
        
        # Create recurring slots (weekly pattern)
        for day in range(7):  # 0=Monday, 6=Sunday
            if day < 5:  # Weekdays only
                # Morning slot
                morning_slot = TimeSlot(
                    doctor_id=doctor_profile.id,
                    start_time=today.replace(hour=9, minute=0) + timedelta(days=day),
                    end_time=today.replace(hour=12, minute=0) + timedelta(days=day),
                    slot_type=SlotType.RECURRING,
                    recurrence_pattern=RecurrencePattern.WEEKLY,
                    recurrence_day=day,
                    is_available=True
                )
                db.session.add(morning_slot)
                
                # Afternoon slot
                afternoon_slot = TimeSlot(
                    doctor_id=doctor_profile.id,
                    start_time=today.replace(hour=14, minute=0) + timedelta(days=day),
                    end_time=today.replace(hour=17, minute=0) + timedelta(days=day),
                    slot_type=SlotType.RECURRING,
                    recurrence_pattern=RecurrencePattern.WEEKLY,
                    recurrence_day=day,
                    is_available=True
                )
                db.session.add(afternoon_slot)
        
        # Create custom slots for the next 14 days
        for day in range(14):
            slot_date = today + timedelta(days=day)
            
            # Skip weekends for custom slots
            if slot_date.weekday() >= 5:  # Saturday or Sunday
                continue
            
            # Create 30-minute slots
            for hour in [9, 10, 11, 14, 15, 16]:
                for minute in [0, 30]:
                    slot = TimeSlot(
                        doctor_id=doctor_profile.id,
                        start_time=slot_date.replace(hour=hour, minute=minute),
                        end_time=slot_date.replace(hour=hour, minute=minute) + timedelta(minutes=30),
                        slot_type=SlotType.CUSTOM,
                        is_available=True
                    )
                    db.session.add(slot)
    
    # Commit time slots
    db.session.commit()
    
    # Create some appointments
    # Get available slots
    available_slots = TimeSlot.query.filter_by(is_available=True).order_by(TimeSlot.start_time).all()
    
    # Create appointments with different statuses
    statuses = [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, 
                AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]
    
    for i in range(min(10, len(available_slots))):
        slot = available_slots[i]
        patient = random.choice(patients)
        doctor_profile = DoctorProfile.query.get(slot.doctor_id)
        
        appointment = Appointment(
            patient_id=patient.id,
            doctor_id=doctor_profile.user_id,
            time_slot_id=slot.id,
            status=statuses[i % len(statuses)],
            reason="Regular checkup",
            symptoms="Headache, fever" if i % 3 == 0 else None,
            medical_history="No significant medical history" if i % 2 == 0 else None
        )
        
        # Mark slot as unavailable
        slot.is_available = False
        
        db.session.add(appointment)
    
    # Create admin settings
    admin_settings = AdminSettings()
    db.session.add(admin_settings)
    
    # Commit all changes
    db.session.commit()
    
    print("Database seeded successfully!")

def main():
    app = create_app()
    with app.app_context():
        seed_database()

if __name__ == "__main__":
    main()