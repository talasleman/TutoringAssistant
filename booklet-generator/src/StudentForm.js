import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function StudentForm() {
    const [formData, setFormData] = useState({
      studentName: '',
      grade: '',
      topic: '',
      theme: '',
      notes: ''
    });
    const [pdfData, setPdfData] = useState(null);
    const [booklet, setBooklet] = useState('');
    const [showForm, setShowForm] = useState(true);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        const response = await fetch('http://localhost:8000/submit-form/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);
          setPdfData(pdfUrl);
          setBooklet(blob);
          setShowForm(false);

          console.log('Success:', booklet);
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
      console.log(formData);
    };

    const handleNewBooklet = () => {
      setBooklet('');
      setShowForm(true); 
    };
  
    return (
      <div> {showForm ? (
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formStudentName">
          <Form.Label>Student Name</Form.Label>
          <Form.Control
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
          />
        </Form.Group>
  
        <Form.Group controlId="formGrade">
          <Form.Label>Grade</Form.Label>
          <Form.Control
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="Enter grade"
          />
        </Form.Group>
  
        <Form.Group controlId="formTopic">
          <Form.Label>Topic</Form.Label>
          <Form.Control
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Enter topic, be as Specific as Needed"
          />
        </Form.Group>
  
        <Form.Group controlId="formTheme">
          <Form.Label>Theme</Form.Label>
          <Form.Select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
          >
            <option>Choose a theme...</option>
            <option value="soccer">Soccer</option>
            <option value="princess">Princess</option>
            <option value="party">Party</option>
          </Form.Select>
        </Form.Group>
  
        <Form.Group controlId="formNotes">
          <Form.Label>Notes (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
          <Form.Text className="text-muted">
          Enter Notes that are unique to the student that could help make a more customized booklet e.g.:
            favourite subjects, strengths, weaknesses, learning disability, etc.
        </Form.Text>
        </Form.Group>
        <br></br>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      ) : (
        <div>
          <h3>Generated Booklet</h3>
          <>
          <iframe src={pdfData} width="100%" height="600px"></iframe>
          <a href={pdfData} download="generated_booklet.pdf">Download Booklet</a>
        </>
          <button onClick={handleNewBooklet}>Generate another booklet</button>
        </div>
      )}

      </div>

    );
  }
  
  export default StudentForm;
  