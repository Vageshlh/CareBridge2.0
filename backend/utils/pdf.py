from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime
import os

def generate_prescription_pdf(prescription, output_path):
    """
    Generate a PDF for a prescription
    
    Args:
        prescription: The Prescription model instance
        output_path: The path where the PDF will be saved
    """
    # Get related data
    appointment = prescription.appointment
    doctor = prescription.doctor
    patient = prescription.patient
    doctor_profile = doctor.doctor_profile
    
    # Create the PDF document
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Create custom styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        alignment=1,  # Center alignment
        spaceAfter=12
    )
    
    header_style = ParagraphStyle(
        'Header',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=10
    )
    
    normal_style = styles['Normal']
    normal_bold = ParagraphStyle(
        'NormalBold',
        parent=normal_style,
        fontName='Helvetica-Bold'
    )
    
    # Build the content
    content = []
    
    # Add logo if available
    # logo_path = os.path.join(os.path.dirname(__file__), '../static/images/logo.png')
    # if os.path.exists(logo_path):
    #     img = Image(logo_path, width=1.5*inch, height=0.5*inch)
    #     content.append(img)
    
    # Title
    content.append(Paragraph('MEDICAL PRESCRIPTION', title_style))
    content.append(Spacer(1, 0.25*inch))
    
    # Doctor and clinic information
    doctor_info = [
        [Paragraph('<b>Doctor:</b>', normal_style), 
         Paragraph(f"Dr. {doctor.first_name} {doctor.last_name}", normal_style)],
        [Paragraph('<b>Specialty:</b>', normal_style), 
         Paragraph(doctor_profile.specialty, normal_style)],
        [Paragraph('<b>License Number:</b>', normal_style), 
         Paragraph(doctor_profile.license_number, normal_style)],
        [Paragraph('<b>Clinic:</b>', normal_style), 
         Paragraph(doctor_profile.clinic.name if doctor_profile.clinic else 'N/A', normal_style)],
    ]
    
    doctor_table = Table(doctor_info, colWidths=[1.5*inch, 4*inch])
    doctor_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ]))
    
    content.append(doctor_table)
    content.append(Spacer(1, 0.25*inch))
    
    # Patient information
    content.append(Paragraph('Patient Information', header_style))
    
    patient_info = [
        [Paragraph('<b>Name:</b>', normal_style), 
         Paragraph(f"{patient.first_name} {patient.last_name}", normal_style)],
        [Paragraph('<b>Date of Birth:</b>', normal_style), 
         Paragraph(patient.date_of_birth.strftime('%Y-%m-%d') if patient.date_of_birth else 'N/A', normal_style)],
        [Paragraph('<b>Gender:</b>', normal_style), 
         Paragraph(patient.gender.value if patient.gender else 'N/A', normal_style)],
    ]
    
    patient_table = Table(patient_info, colWidths=[1.5*inch, 4*inch])
    patient_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ]))
    
    content.append(patient_table)
    content.append(Spacer(1, 0.25*inch))
    
    # Prescription details
    content.append(Paragraph('Prescription Details', header_style))
    
    # Date information
    date_info = [
        [Paragraph('<b>Prescription Date:</b>', normal_style), 
         Paragraph(prescription.created_at.strftime('%Y-%m-%d'), normal_style)],
        [Paragraph('<b>Appointment Date:</b>', normal_style), 
         Paragraph(appointment.start_time.strftime('%Y-%m-%d %H:%M'), normal_style)],
    ]
    
    date_table = Table(date_info, colWidths=[1.5*inch, 4*inch])
    date_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ]))
    
    content.append(date_table)
    content.append(Spacer(1, 0.25*inch))
    
    # Diagnosis
    if prescription.diagnosis:
        content.append(Paragraph('<b>Diagnosis:</b>', normal_bold))
        content.append(Paragraph(prescription.diagnosis, normal_style))
        content.append(Spacer(1, 0.15*inch))
    
    # Medications
    content.append(Paragraph('<b>Medications:</b>', normal_bold))
    content.append(Paragraph(prescription.medications, normal_style))
    content.append(Spacer(1, 0.15*inch))
    
    # Dosage
    if prescription.dosage:
        content.append(Paragraph('<b>Dosage:</b>', normal_bold))
        content.append(Paragraph(prescription.dosage, normal_style))
        content.append(Spacer(1, 0.15*inch))
    
    # Frequency
    if prescription.frequency:
        content.append(Paragraph('<b>Frequency:</b>', normal_bold))
        content.append(Paragraph(prescription.frequency, normal_style))
        content.append(Spacer(1, 0.15*inch))
    
    # Duration
    if prescription.duration:
        content.append(Paragraph('<b>Duration:</b>', normal_bold))
        content.append(Paragraph(prescription.duration, normal_style))
        content.append(Spacer(1, 0.15*inch))
    
    # Instructions
    content.append(Paragraph('<b>Instructions:</b>', normal_bold))
    content.append(Paragraph(prescription.instructions, normal_style))
    content.append(Spacer(1, 0.15*inch))
    
    # Notes
    if prescription.notes:
        content.append(Paragraph('<b>Additional Notes:</b>', normal_bold))
        content.append(Paragraph(prescription.notes, normal_style))
        content.append(Spacer(1, 0.15*inch))
    
    # Signature
    content.append(Spacer(1, 0.5*inch))
    content.append(Paragraph('_______________________________', normal_style))
    content.append(Paragraph(f"Dr. {doctor.first_name} {doctor.last_name}", normal_style))
    content.append(Paragraph(doctor_profile.specialty, normal_style))
    
    # Build the PDF
    doc.build(content)
    
    return output_path