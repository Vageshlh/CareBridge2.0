import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useTheme } from '../context/ThemeContext';
import { FormGroup, FormLabel, FormInput, FormTextarea, FormSelect, FormHelperText } from '../components/Form';

const ThemeTestPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className={`container mx-auto py-8 px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <h1 className="text-3xl font-bold mb-6">Theme Test Page</h1>
      <p className="mb-4">Current theme: <strong>{theme}</strong></p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Theme Toggle</h2>
        <Button onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Default Card</h3>
            </CardHeader>
            <CardBody>
              <p>This is a default card with header, body, and footer.</p>
            </CardBody>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card hoverable>
            <CardHeader>
              <h3 className="text-lg font-medium">Hoverable Card</h3>
            </CardHeader>
            <CardBody>
              <p>This card has the hoverable prop set to true.</p>
            </CardBody>
            <CardFooter>
              <Button variant="secondary" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="light">Light</Button>
          <Button variant="dark">Dark</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Test Modal"
        >
          <div>
            <p className="mb-4">This is a test modal to verify dark mode styling.</p>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Form Components Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Form Components</h2>
        <Card>
          <CardBody>
            <FormGroup>
              <FormLabel htmlFor="name" required>Name</FormLabel>
              <FormInput id="name" placeholder="Enter your name" />
              <FormHelperText>Your full name as it appears on your ID</FormHelperText>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                error="Please enter a valid email address"
                touched={true}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormTextarea id="message" rows={4} placeholder="Enter your message" />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="country">Country</FormLabel>
              <FormSelect 
                id="country" 
                options={[
                  { value: '', label: 'Select a country' },
                  { value: 'us', label: 'United States' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'uk', label: 'United Kingdom' },
                ]}
              />
            </FormGroup>

            <div className="mt-4">
              <Button variant="primary">Submit Form</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ThemeTestPage;