# replit.md

## Overview

This is a Digital Letter Management System (Sistem Pengelolaan Surat Digital) built for the Department of Labor (Dinas Ketenagakerjaan) of Asahan Regency. The system is designed as a modern web application to manage incoming and outgoing official letters, with features for user authentication, document tracking, reporting, and administrative functions. The application supports multiple user roles including Staff, Department Head, Secretary, Agency Head, and Administrator, each with appropriate permissions and access levels.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript with no external frontend frameworks
- **UI Design**: Modern glass morphism design system with gradient color palettes and responsive layout
- **Page Structure**: Single-page application (SPA) architecture with dynamic content loading
- **Navigation**: Sidebar-based navigation with role-based menu visibility
- **Responsive Design**: Mobile-first approach with breakpoints for different screen sizes

### Authentication System
- **Method**: JWT-based authentication with localStorage for session management
- **User Roles**: Hierarchical role system (Staff, Kepala Bidang, Sekretaris, Kepala Dinas, Administrator)
- **Session Management**: Token-based authentication with automatic logout on token expiration
- **Security**: Basic password validation and role-based access control

### Data Management
- **Primary Storage**: localStorage-based database simulation for offline functionality
- **Data Structure**: JSON-based data models for users, letters, and system settings
- **Backup Strategy**: Built-in data export/import functionality for data persistence
- **Migration Path**: Prepared SQL schemas for future server-side database implementation

### Backend Architecture (Optional)
- **Server Framework**: Express.js with Node.js runtime
- **Database Options**: 
  - Development: In-memory storage with JSON files
  - Production-ready: MySQL database with prepared schemas
- **API Design**: RESTful endpoints for CRUD operations on letters and users
- **File Handling**: Support for document attachments with size limits

### Letter Management System
- **Document Types**: Incoming letters (Surat Masuk) and outgoing letters (Surat Keluar)
- **Status Tracking**: Draft, pending approval, approved, rejected, and archived states
- **Priority Levels**: High, medium, and low priority classification
- **Numbering System**: Automatic letter numbering with configurable formats
- **Archive Management**: Automatic archiving with retention policies

### User Interface Components
- **Dashboard**: Statistics cards, recent activity, and quick actions
- **Letter Forms**: Rich text editor for letter content with validation
- **Data Tables**: Sortable and filterable tables for letter listings
- **Modal System**: Overlay forms for create, edit, and delete operations
- **Notification System**: Toast notifications for user feedback

## External Dependencies

### Required Node.js Packages
- **express**: Web server framework for API endpoints
- **cors**: Cross-origin resource sharing middleware
- **path**: File path utilities for static file serving
- **nodemon**: Development server with auto-restart capabilities

### Optional Backend Dependencies
- **mysql2**: MySQL database driver with promise support
- **bcrypt**: Password hashing and security (for production implementation)
- **jsonwebtoken**: JWT token generation and validation
- **multer**: File upload handling middleware

### Frontend Libraries
- **No external JavaScript libraries**: Pure vanilla JavaScript implementation
- **Google Fonts**: Inter and JetBrains Mono font families
- **SVG Icons**: Inline SVG icons for UI elements (no icon library dependencies)

### Development Tools
- **Package Management**: npm with package.json configuration
- **Build Process**: Simple static file serving (no build tools required)
- **Version Control**: Git-ready structure with appropriate .gitignore

### Future Integration Points
- **Email System**: SMTP integration for notifications
- **File Storage**: Cloud storage integration for document attachments
- **Database Migration**: Prepared SQL schemas for PostgreSQL or MySQL migration
- **Authentication Provider**: OAuth integration possibilities
- **Reporting System**: PDF generation and export capabilities