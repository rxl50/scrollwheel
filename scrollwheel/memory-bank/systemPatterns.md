# System Patterns

## Architecture
- Modular design separating background scripts, content scripts, and UI components.
- Event-driven communication between background and content scripts using message passing.
- Persistent storage of user settings via browser storage APIs.

## Key Technical Decisions
- Use of WebExtensions API for cross-browser compatibility.
- Background script handles lifecycle events and global state.
- Content script intercepts and modifies scroll wheel events on web pages.
- Popup and options pages provide user interfaces for control and configuration.

## Design Patterns
- Observer pattern for event handling and message passing.
- Singleton pattern for managing extension-wide settings and state.
- Command pattern for encapsulating scroll behavior commands.

## Component Relationships
- Background script acts as central controller.
- Content script acts as view/controller for page-specific interactions.
- Popup and options pages act as views for user interaction.

## Critical Implementation Paths
- Scroll event capture and modification pipeline.
- User settings retrieval and application.
- UI event handling and synchronization with background state.
