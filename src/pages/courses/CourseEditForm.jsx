import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CourseForm.css';
import { useNavigate } from "react-router-dom";
const CourseEditForm = () => {
  const { id } = useParams(); // Get course ID from URL
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseThumbnail: null,
    courseImage: null,
    courseVideo: null
  });

  const [uploadProgress, setUploadProgress] = useState({
    courseThumbnail: '',
    courseImage: '',
    courseVideo: ''
  });

  // Fetch course data by ID
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/course/get-course-by-id/${id}`);
        setCourseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  // Handle file upload
  const handleFileUpload = (e, fieldName, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size based on type
      if (fileType === 'image' && file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }
      if (fileType === 'video' && file.size > 50 * 1024 * 1024) {
        alert('Video file size should be less than 50MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      setUploadProgress(prev => ({
        ...prev,
        [fieldName]: 'File selected'
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if at least one file is selected
    if (!formData.courseThumbnail && !formData.courseImage && !formData.courseVideo) {
      alert('Please select at least one file to update');
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Append only the files that are selected
      if (formData.courseThumbnail) {
        submitData.append('courseThumbnail', formData.courseThumbnail);
      }
      if (formData.courseImage) {
        submitData.append('courseImage', formData.courseThumbnail);
      }
      if (formData.courseVideo) {
        submitData.append('courseVideo', formData.courseVideo);
      }

      // Make PUT request to update course
      const response = await axios.put(
        `http://localhost:3000/course/update-course/${id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Update progress for all active uploads
            setUploadProgress({
              courseThumbnail: formData.courseThumbnail ? `${progress}%` : '',
              courseImage: formData.courseThumbnail ? `${progress}%` : '',
              courseVideo: formData.courseVideo ? `${progress}%` : ''
            });
          }
        }
      );

      if (response.status === 200) {

        navigate(`/dashboard/product_library`);
        // Reset form
        setFormData({
          courseThumbnail: null,
          courseImage: null,
          courseVideo: null
        });
        setUploadProgress({
          courseThumbnail: '',
          courseImage: '',
          courseVideo: ''
        });
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course media files. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Remove selected file
  const removeFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
    setUploadProgress(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  if (loading) {
    return <div className="loading">Loading course data...</div>;
  }

  if (!courseData) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="course-edit-form">
      <h2>Edit Course Media - {courseData.courseName}</h2>
      <p className="course-info">Course ID: {id}</p>
      
      <form onSubmit={handleSubmit}>
        {/* Updated Media Files Section for Single Files */}
        <div className="form-section">
          <h3>Update Media Files</h3>
          <p className="section-description">Select only the files you want to update</p>
          
          {/* Current Media Status */}
          <div className="current-media">
            <h4>Current Media Status:</h4>
            <p>Thumbnail: {courseData.courseThumbnail ? 'Uploaded' : 'Not set'}</p>
            <p>Image: {courseData.courseImage ? 'Uploaded' : 'Not set'}</p>
            <p>Video: {courseData.courseVideo ? 'Uploaded' : 'Not set'}</p>
          </div>

          {/* Course Thumbnail Upload */}
          <div className="form-group">
            <label>Course Thumbnail *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'courseThumbnail', 'image')}
              className="file-input"
            />
            {formData.courseThumbnail && (
              <div className="file-preview">
                <span>Selected: {formData.courseThumbnail.name}</span>
                <span className="file-status">{uploadProgress.courseThumbnail}</span>
                <button 
                  type="button" 
                  onClick={() => removeFile('courseThumbnail')}
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
                  onClick={() => removeFile('courseImage')}
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
                  onClick={() => removeFile('courseVideo')}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            )}
            <small>Supported formats: MP4, MOV, AVI. Max size: 50MB</small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={submitting || (!formData.courseThumbnail && !formData.courseImage && !formData.courseVideo)}
            className="submit-btn"
          >
            {submitting ? 'Updating...' : 'Update Media Files'}
          </button>
          
          <button 
            type="button" 
            onClick={() => window.history.back()}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditForm;