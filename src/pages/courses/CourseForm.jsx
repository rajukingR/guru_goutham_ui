import React, { useState } from 'react';
import axios from 'axios';
import './CourseForm.css';

const CourseForm = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCategory: '',
    subCategories: [],
    courseDescription: '',
    courseShortDescription: '',
    courseThumbnail: null,
    courseImage: null, // Single image file
    courseVideo: null, // Single video file
    whatTheyLearn: [''],
    courseRequirement: [''],
    typeOfCourse: 'Online',
    coursePrice: '',
    courseDuration: '',
    courseYoutubeLink: '',
    courseSeats: '',
    courseSemesters: '',
    courseCurriculum: '',
    lastDateForAdmission: '',
    lessons: '',
    trainerName: '',
    courseStartDate: '',
    courseEndDate: '',
    certifications: '',
    courseLanguague: 'English',
    isFeatured: false,
    popular: 0
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array field changes
  const handleArrayInputChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  // Add new item to array fields
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  // Handle single file upload
  const handleFileUpload = (e, field, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (fileType === 'image' && !file.type.startsWith('image/')) {
      setMessage(`Please select an image file for ${field}`);
      return;
    }
    if (fileType === 'video' && !file.type.startsWith('video/')) {
      setMessage(`Please select a video file for ${field}`);
      return;
    }

    // Validate file size
    const maxSize = fileType === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage(`${field} size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: file
    }));

    setUploadProgress(prev => ({
      ...prev,
      [field]: 'Selected'
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append('courseName', formData.courseName);
      formDataToSend.append('courseCategory', formData.courseCategory);
      formDataToSend.append('courseDescription', formData.courseDescription);
      formDataToSend.append('courseShortDescription', formData.courseShortDescription);
      formDataToSend.append('typeOfCourse', formData.typeOfCourse);
      formDataToSend.append('coursePrice', formData.coursePrice);
      formDataToSend.append('courseDuration', formData.courseDuration);
      formDataToSend.append('courseYoutubeLink', formData.courseYoutubeLink);
      formDataToSend.append('courseSeats', formData.courseSeats);
      formDataToSend.append('courseSemesters', formData.courseSemesters);
      formDataToSend.append('courseCurriculum', formData.courseCurriculum);
      formDataToSend.append('lastDateForAdmission', formData.lastDateForAdmission);
      formDataToSend.append('lessons', formData.lessons);
      formDataToSend.append('trainerName', formData.trainerName);
      formDataToSend.append('courseStartDate', formData.courseStartDate);
      formDataToSend.append('courseEndDate', formData.courseEndDate);
      formDataToSend.append('certifications', formData.certifications);
      formDataToSend.append('courseLanguague', formData.courseLanguague);
      formDataToSend.append('isFeatured', formData.isFeatured);
      formDataToSend.append('popular', formData.popular);

      // Append array fields
      formData.subCategories.forEach((item, index) => {
        formDataToSend.append(`subCategories[${index}]`, item);
      });

      formData.whatTheyLearn.forEach((item, index) => {
        formDataToSend.append(`whatTheyLearn[${index}]`, item);
      });

      formData.courseRequirement.forEach((item, index) => {
        formDataToSend.append(`courseRequirement[${index}]`, item);
      });

      // Append files
      if (formData.courseThumbnail) {
        formDataToSend.append('courseThumbnail', formData.courseThumbnail);
      }
      if (formData.courseImage) {
        formDataToSend.append('courseImage', formData.courseImage);
      }
      if (formData.courseVideo) {
        formDataToSend.append('courseVideo', formData.courseVideo);
      }

      const response = await axios.post(
        'http://localhost:3000/course/create-course-admin',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              overall: `Uploading... ${progress}%`
            }));
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage('Course created successfully!');
        
        // Reset form
        setFormData({
          courseName: '',
          courseCategory: '',
          subCategories: [],
          courseDescription: '',
          courseShortDescription: '',
          courseThumbnail: null,
          courseImage: null,
          courseVideo: null,
          whatTheyLearn: [''],
          courseRequirement: [''],
          typeOfCourse: 'Online',
          coursePrice: '',
          courseDuration: '',
          courseYoutubeLink: '',
          courseSeats: '',
          courseSemesters: '',
          courseCurriculum: '',
          lastDateForAdmission: '',
          lessons: '',
          trainerName: '',
          courseStartDate: '',
          courseEndDate: '',
          certifications: '',
          courseLanguague: 'English',
          isFeatured: false,
          popular: 0
        });
        
        setUploadProgress({});
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('Error creating course: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="course-form-container">
      <h2>Create New Course</h2>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {uploadProgress.overall && (
        <div className="progress-message">
          {uploadProgress.overall}
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Course Name *</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Course Category *</label>
            <select
              name="courseCategory"
              value={formData.courseCategory}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="graduate">Graduate</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sub Categories</label>
            {formData.subCategories.map((subCat, index) => (
              <div key={index} className="array-input-group">
                <input
                  type="text"
                  value={subCat}
                  onChange={(e) => handleArrayInputChange('subCategories', index, e.target.value)}
                  placeholder="Enter sub category"
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayItem('subCategories', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addArrayItem('subCategories')}
              className="add-btn"
            >
              Add Sub Category
            </button>
          </div>

          <div className="form-group">
            <label>Course Description *</label>
            <textarea
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Short Description *</label>
            <textarea
              name="courseShortDescription"
              value={formData.courseShortDescription}
              onChange={handleInputChange}
              rows="2"
              required
            />
          </div>
        </div>

         {/* Updated Media Files Section for Single Files */}
        <div className="form-section">
          <h3>Media Files</h3>
          
          {/* Course Thumbnail Upload */}
          <div className="form-group">
            <label>Course Thumbnail *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'courseThumbnail', 'image')}
              className="file-input"
              required
            />
            {formData.courseThumbnail && (
              <div className="file-preview">
                <span>Selected: {formData.courseThumbnail.name}</span>
                <span className="file-status">{uploadProgress.courseThumbnail}</span>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, courseThumbnail: null }))}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            )}
            <small>Supported formats: JPG, PNG, GIF. Max size: 5MB</small>
          </div>

          {/* Course Image Upload */}
          <div className="form-group">
            <label>Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'courseImage', 'image')}
              className="file-input"
            />
            {formData.courseImage && (
              <div className="file-preview">
                <span>Selected: {formData.courseImage.name}</span>
                <span className="file-status">{uploadProgress.courseImage}</span>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, courseImage: null }))}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            )}
            <small>Supported formats: JPG, PNG, GIF. Max size: 5MB</small>
          </div>

          {/* Course Video Upload */}
          <div className="form-group">
            <label>Course Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, 'courseVideo', 'video')}
              className="file-input"
            />
            {formData.courseVideo && (
              <div className="file-preview">
                <span>Selected: {formData.courseVideo.name}</span>
                <span className="file-status">{uploadProgress.courseVideo}</span>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, courseVideo: null }))}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            )}
            <small>Supported formats: MP4, MOV, AVI. Max size: 50MB</small>
          </div>
        </div>

        {/* Learning Objectives & Requirements */}
        <div className="form-section">
          <h3>What Students Will Learn</h3>
          {formData.whatTheyLearn.map((item, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayInputChange('whatTheyLearn', index, e.target.value)}
                placeholder="Enter learning objective"
              />
              <button 
                type="button" 
                onClick={() => removeArrayItem('whatTheyLearn', index)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => addArrayItem('whatTheyLearn')}
            className="add-btn"
          >
            Add Learning Objective
          </button>

          <h3>Course Requirements</h3>
          {formData.courseRequirement.map((req, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayInputChange('courseRequirement', index, e.target.value)}
                placeholder="Enter requirement"
              />
              <button 
                type="button" 
                onClick={() => removeArrayItem('courseRequirement', index)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => addArrayItem('courseRequirement')}
            className="add-btn"
          >
            Add Requirement
          </button>
        </div>

        {/* Course Details */}
        <div className="form-section">
          <h3>Course Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Type of Course</label>
              <select
                name="typeOfCourse"
                value={formData.typeOfCourse}
                onChange={handleInputChange}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Course Price (₹)</label>
              <input
                type="number"
                name="coursePrice"
                value={formData.coursePrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Course Duration</label>
              <input
                type="text"
                name="courseDuration"
                value={formData.courseDuration}
                onChange={handleInputChange}
                placeholder="4 Months"
              />
            </div>

            <div className="form-group">
              <label>Number of Lessons</label>
              <input
                type="number"
                name="lessons"
                value={formData.lessons}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Available Seats</label>
              <input
                type="number"
                name="courseSeats"
                value={formData.courseSeats}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Number of Semesters</label>
              <input
                type="number"
                name="courseSemesters"
                value={formData.courseSemesters}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>YouTube Link</label>
            <input
              type="url"
              name="courseYoutubeLink"
              value={formData.courseYoutubeLink}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=example"
            />
          </div>

          <div className="form-group">
            <label>Course Curriculum</label>
            <textarea
              name="courseCurriculum"
              value={formData.courseCurriculum}
              onChange={handleInputChange}
              rows="4"
              placeholder="Module 1: Frontend, Module 2: Backend..."
            />
          </div>
        </div>

        {/* Dates & Additional Info */}
        <div className="form-section">
          <h3>Dates & Additional Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Last Date for Admission</label>
              <input
                type="date"
                name="lastDateForAdmission"
                value={formData.lastDateForAdmission}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Course Start Date</label>
              <input
                type="date"
                name="courseStartDate"
                value={formData.courseStartDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Course End Date</label>
              <input
                type="date"
                name="courseEndDate"
                value={formData.courseEndDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Trainer Name</label>
              <input
                type="text"
                name="trainerName"
                value={formData.trainerName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Course Language</label>
              <select
                name="courseLanguague"
                value={formData.courseLanguague}
                onChange={handleInputChange}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Certifications</label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              placeholder="Advanced MERN Developer Certificate"
            />
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                Featured Course
              </label>
            </div>

            <div className="form-group">
              <label>Popularity Rating (0-5)</label>
              <input
                type="number"
                name="popular"
                value={formData.popular}
                onChange={handleInputChange}
                min="0"
                max="5"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating Course...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;