// Content script for ScrollCircle Chrome extension
console.log("Content script loaded");

class ScrollCircle {
  constructor() {
    this.isActive = false;
    this.circle = null;
    this.isDragging = false;
    this.isScrolling = false;
    this.scrollAnimation = null;
    this.settings = window.scrollCircleSettings || {
      speedMultiplier: 1.3,
      circleSize: 120,
      circleOpacity: 0.3,
      highContrast: false
    };

    // Apply settings immediately if available
    if (window.scrollCircleSettings) {
      this.settings = { ...this.settings, ...window.scrollCircleSettings };
    }

    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.scrollPage = this.scrollPage.bind(this);

    // Last known position for persistence
    this.lastPosition = { x: 150, y: 150 };

    // Listen for wheel events in all frames
    window.addEventListener('wheel', this.handleWheelEvent.bind(this), { passive: false });
  }

  handleWheelEvent(event) {
    // Always prevent default to handle scrolling ourselves
    event.preventDefault();
    event.stopPropagation();

    // Calculate scroll amounts
    const scrollX = event.deltaX;
    const scrollY = event.deltaY;

    // Propagate to top-level window if in iframe
    if (window.self !== window.top) {
      window.top.postMessage({
        type: 'scroll-wheel',
        scrollX,
        scrollY
      }, '*');
    } else {
      // In top window, scroll directly
      window.scrollBy({ left: scrollX, top: scrollY, behavior: 'auto' });
    }
  }

  removeCircle() {
    if (!this.circle) return;

    // Save position
    const rect = this.circle.getBoundingClientRect();
    this.lastPosition = { x: rect.left, y: rect.top };

    // Stop any ongoing scroll
    this.stopScrolling();

    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    // Remove element
    this.circle.remove();
    this.circle = null;
  }

  handleMouseDown(e) {
    if (e.button !== 0) return; // Only left click

    e.preventDefault();
    this.isDragging = true;
    this.dragOffset = {
      x: e.clientX - this.circle.offsetLeft,
      y: e.clientY - this.circle.offsetTop
    };

    this.circle.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.circle.style.cursor = 'move';
    document.body.style.userSelect = '';

    // Save new position
    const rect = this.circle.getBoundingClientRect();
    this.lastPosition = { x: rect.left, y: rect.top };
  }

  handleMouseMove(e) {
    if (this.isDragging) {
      // Dragging the circle
      const newX = Math.max(0, Math.min(window.innerWidth - this.settings.circleSize,
        e.clientX - this.dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - this.settings.circleSize,
        e.clientY - this.dragOffset.y));

      this.circle.style.left = newX + 'px';
      this.circle.style.top = newY + 'px';
      return;
    }

    // Check if mouse is inside circle
    const rect = this.circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distanceFromCenter = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );

    if (distanceFromCenter <= radius) {
      // Mouse is inside circle - start scrolling
      if (!this.isScrolling) {
        this.startScrolling();
      }

      // Calculate scroll direction and speed
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const normalizedDistance = Math.min(distanceFromCenter / radius, 1);

      this.scrollVector = {
        x: (deltaX / radius) * this.settings.speedMultiplier * normalizedDistance,
        y: (deltaY / radius) * this.settings.speedMultiplier * normalizedDistance
      };

      // Visual feedback
      this.circle.style.borderColor = '#34a853';
    } else {
      // Mouse is outside circle - stop scrolling
      if (this.isScrolling) {
        this.stopScrolling();
      }
      this.circle.style.borderColor = this.settings.highContrast ? '#000' : '#4285f4';
    }
  }

  handleKeyDown(e) {
    // Keyboard navigation for accessibility
    const step = 10;
    let newX = parseInt(this.circle.style.left);
    let newY = parseInt(this.circle.style.top);

    switch (e.key) {
      case 'ArrowLeft':
        newX = Math.max(0, newX - step);
        break;
      case 'ArrowRight':
        newX = Math.min(window.innerWidth - this.settings.circleSize, newX + step);
        break;
      case 'ArrowUp':
        newY = Math.max(0, newY - step);
        break;
      case 'ArrowDown':
        newY = Math.min(window.innerHeight - this.settings.circleSize, newY + step);
        break;
      case 'Escape':
        this.toggle();
        return;
      default:
        return;
    }

    e.preventDefault();
    this.circle.style.left = newX + 'px';
    this.circle.style.top = newY + 'px';

    // Save position
    this.lastPosition = { x: newX, y: newY };
  }

  startScrolling() {
    this.isScrolling = true;
    this.scrollPage();
  }

  stopScrolling() {
    this.isScrolling = false;
    if (this.scrollAnimation) {
      cancelAnimationFrame(this.scrollAnimation);
      this.scrollAnimation = null;
    }
  }

  scrollPage() {
    if (!this.isScrolling || !this.scrollVector) return;

    // Get scrollable element at circle center
    const rect = this.circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate scroll amounts
    const scrollX = this.scrollVector.x * 5;
    const scrollY = this.scrollVector.y * 5;

    // Try scrolling common containers first
    const scrollableElements = [
      document.documentElement,
      document.body,
      ...Array.from(document.querySelectorAll('div, section, main, article'))
    ].filter(function(el) {
      const style = window.getComputedStyle(el);
      const isScrollableY = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        el.scrollHeight > el.clientHeight;
      const isScrollableX = (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
        el.scrollWidth > el.clientWidth;
      return isScrollableY || isScrollableX;
    });

    // Scroll the first scrollable element under cursor
    let scrolled = false;
    for (const el of scrollableElements) {
      const elRect = el.getBoundingClientRect();
      if (centerX >= elRect.left && centerX <= elRect.right &&
        centerY >= elRect.top && centerY <= elRect.bottom) {
        el.scrollBy({ left: scrollX, top: scrollY, behavior: 'auto' });
        scrolled = true;
        break;
      }
    }

    // Fallback to window scrolling
    if (!scrolled) {
      window.scrollBy({ left: scrollX, top: scrollY, behavior: 'auto' });
    }

    // Continue scrolling
    this.scrollAnimation = requestAnimationFrame(this.scrollPage);
  }


  toggle() {
    console.log("Toggle function called");
    if (this.isActive) {
      this.removeCircle();
      this.isActive = false;
      return false;
    } else {
      // Always create circle in current context
      this.createCircle();
      this.isActive = true;

      // If in iframe, notify top window
      if (window.self !== window.top) {
        window.top.postMessage({
          type: 'scroll-circle-activated',
          frameId: window.name || window.location.href
        }, '*');
      }
      return true;
    }
  }

  createCircle() {
    if (this.circle) return;

    try {
      console.log(`Creating scroll circle in frame: ${window.location.href}`);
      console.log(`Document state - head: ${!!document.head}, body: ${!!document.body}, documentElement: ${!!document.documentElement}`);

      // Create container
      this.circle = document.createElement('div');
      this.circle.id = 'scroll-circle-container';

      // Log environment details for debugging
      console.log('Window context:', {
        self: window.self,
        top: window.top,
        parent: window.parent,
        frameElement: window.frameElement,
        location: window.location.href
      });

      // Create dynamic styles to avoid CSP issues
      const style = document.createElement('style');
      style.textContent = `
        #scroll-circle-container {
          position: fixed;
          width: ${this.settings.circleSize}px;
          height: ${this.settings.circleSize}px;
          border: 3px solid ${this.settings.highContrast ? '#000' : '#4285f4'};
          border-radius: 50%;
          background: rgba(66, 133, 244, ${this.settings.circleOpacity})`;
      style.textContent += `
          cursor: move;
          z-index: 10000;
          user-select: none;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          left: ${this.lastPosition.x}px;
          top: ${this.lastPosition.y}px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          transition: border-color 0.2s ease;
        }
      `;

      // Append to head or documentElement with fallback
      if (document.head) {
        document.head.appendChild(style);
      } else if (document.documentElement) {
        document.documentElement.appendChild(style);
      }

      // Create center dot with class only (no inline styles)
      const centerDot = document.createElement('div');
      centerDot.classList.add('scroll-circle-center-dot');

      // Add center dot styles with fallback
      const centerDotStyle = document.createElement('style');
      centerDotStyle.textContent = `
        .scroll-circle-center-dot {
          width: 8px;
          height: 8px;
          background: ${this.settings.highContrast ? '#000' : '#1a73e8'};
          border-radius: 50%;
          pointer-events: none;
        }
      `;

      // Append to head or documentElement
      if (document.head) {
        document.head.appendChild(centerDotStyle);
      } else if (document.documentElement) {
        document.documentElement.appendChild(centerDotStyle);
      }

      this.circle.appendChild(centerDot);

      // Add ARIA attributes for accessibility
      this.circle.setAttribute('role', 'application');
      this.circle.setAttribute('aria-label', 'ScrollCircle: Drag to position, move mouse inside to scroll');
      this.circle.setAttribute('tabindex', '0');

      // Add event listeners
      this.circle.addEventListener('mousedown', this.handleMouseDown, { passive: false });
      this.circle.addEventListener('keydown', this.handleKeyDown);

      // Try to append to body, fallback to documentElement if needed
      if (document.body) {
        document.body.appendChild(this.circle);
      } else if (document.documentElement) {
        document.documentElement.appendChild(this.circle);
      } else {
        // Try to find any container element
        let root = document.querySelector('html, body') || document.firstElementChild;

        // If still not found and we're in a frame, try the frame element
        if (!root && window.frameElement) {
          root = window.frameElement;
          console.log('Appending to frame element');
        }

        if (root) {
          root.appendChild(this.circle);
          console.log('Appended scroll circle to root element');
        } else {
          console.error('No suitable root element found for scroll circle');

          // Last resort: create a container div
          const container = document.createElement('div');
          container.id = 'scroll-circle-container-root';
          container.appendChild(this.circle);

          // Try to append container to document
          try {
            document.appendChild(container);
            console.log('Created container div for scroll circle');
          } catch (e) {
            console.error('Failed to append scroll circle container:', e);
          }
        }
      }

      // Add global mouse listeners
      document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      document.addEventListener('mouseup', this.handleMouseUp, { passive: true });
    } catch (e) {
      console.error('ScrollCircle creation error:', e);
      if (this.circle && this.circle.parentNode) {
        this.circle.parentNode.removeChild(this.circle);
      }
      this.circle = null;
      this.isActive = false;
    }
  }

   updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    window.scrollCircleSettings = this.settings;
    console.log("Received settings:", this.settings);

    if (this.circle) {
      // Update circle appearance
      this.circle.style.width = this.settings.circleSize + 'px';
      this.circle.style.height = this.settings.circleSize + 'px';
      this.circle.style.background = `rgba(66, 133, 244, ${this.settings.circleOpacity})`;
      this.circle.style.borderColor = this.settings.highContrast ? '#000' : '#4285f4';

      // Update center dot style
      const centerDot = this.circle.querySelector('div');
      if (centerDot) {
        centerDot.style.background = this.settings.highContrast ? '#000' : '#1a73e8';
      }
    }
  }
}

// Initialize ScrollCircle only in top-level contexts
if (window.self === window.top) {
  const scrollCircle = new ScrollCircle();
  window.scrollCircle = scrollCircle; // Store reference globally
  window.scrollCircleToggle = () => scrollCircle.toggle();

  // Handle page unload
  window.addEventListener('beforeunload', () => {
    if (scrollCircle.isActive) {
      const rect = scrollCircle.circle?.getBoundingClientRect();
      if (rect) {
        // We don't save to storage anymore
      }
    }
  });
}

// Global toggle function that works in all contexts
window.toggleScrollCircle = function() {
  if (window.self === window.top && typeof window.scrollCircleToggle === 'function') {
    return window.scrollCircleToggle();
  }

  // For iframes, communicate with top window
  if (window.self !== window.top) {
    window.top.postMessage({ type: 'toggle-scroll-circle' }, '*');
    return true;
  }

  return false;
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggle-scroll-circle') {
    console.log("Received toggle-scroll-circle message");
    const isActive = window.scrollCircleToggle();
    sendResponse({ isActive });
  }
  return true;
});

// Listen for messages from other frames
window.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;

  try {
    switch (event.data.type) {
      case 'toggle-scroll-circle':
        if (window.self === window.top && typeof window.scrollCircleToggle === 'function') {
          window.scrollCircleToggle();
        } else if (window.self !== window.top) {
          // Propagate up to top window
          window.top.postMessage(event.data, '*');
        }
        break;

      case 'scroll-wheel':
        if (window.self === window.top) {
          window.scrollBy({
            left: event.data.scrollX,
            top: event.data.scrollY,
            behavior: 'auto'
          });
        } else {
          // Propagate up to top window
          window.top.postMessage(event.data, '*');
        }
        break;

      case 'scroll-circle-activated':
        if (window.self === window.top) {
          console.log(`ScrollCircle activated in frame: ${event.data.frameId}`);
        }
        break;
    }
  } catch (e) {
    console.warn('ScrollCircle message handling error:', e);
  }
});
