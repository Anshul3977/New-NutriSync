import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted: ', formData);
    // Here you can implement form submission logic, e.g., sending it to a server or API.
  };

  return (
    <section className="contact-section">
      <div className="contact-form">
        <h2>We're here to assist you!</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name *
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email address *
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone number *
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
            />
          </label>

          <label className="consent">
            <input type="checkbox" required /> I allow this website to store my
            submission so they can respond to my inquiry.
          </label>

          <button type="submit">SUBMIT</button>
        </form>
      </div>

      <div className="contact-info">
        <div className="location">
          <h3>Location</h3>
          <p>Jalgaon, MH IN</p>
        </div>

        <div className="hours">
          <h3>Hours</h3>
          <ul>
            <li>Monday – Friday: 9:00am – 10:00pm</li>
            <li>Saturday: 9:00am – 6:00pm</li>
            <li>Sunday: 9:00am – 12:00pm</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;