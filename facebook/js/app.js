// Main Application Logic
class NexusApp {
    constructor() {
        this.currentUser = null;
        this.stories = [];
        this.reels = [];
        this.posts = [];
        this.init();
    }

    init() {
        this.loadUser();
        this.initializeComponents();
        this.setupEventListeners();
    }

    loadUser() {
        const user = localStorage.getItem('nexus_user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.updateUIForUser();
        } else {
            window.location.href = 'login.html';
        }
    }

    initializeComponents() {
        // Initialize all components
        this.storyComponent = new StoryComponent();
        this.reelComponent = new ReelComponent();
        this.exploreComponent = new ExploreComponent();
        this.postComponent = new PostComponent();
        this.notificationComponent = new NotificationComponent();
        this.messageComponent = new MessageComponent();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleTabChange(e));
        });

        // Quick Actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });

        // Modal Close
        document.querySelectorAll('.modal-close').forEach(close => {
            close.addEventListener('click', () => this.closeAllModals());
        });
    }

    handleTabChange(e) {
        const tabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('section[data-section]');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');

        const targetSection = e.target.getAttribute('data-section');
        sections.forEach(section => {
            section.style.display = section.getAttribute('data-section') === targetSection ? 'block' : 'none';
        });
    }

    handleQuickAction(e) {
        const action = e.currentTarget.getAttribute('data-action');
        switch(action) {
            case 'create':
                this.showCreationModal();
                break;
            case 'camera':
                this.openCamera();
                break;
            case 'message':
                this.openMessages();
                break;
        }
    }

    showCreationModal() {
        const modal = document.querySelector('.creation-modal');
        modal.style.display = 'flex';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    openCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const videoModal = document.querySelector('.camera-modal');
                const video = videoModal.querySelector('video');
                video.srcObject = stream;
                videoModal.style.display = 'flex';
            })
            .catch(err => {
                console.error('Camera access denied:', err);
                this.showNotification('Camera access denied', 'error');
            });
    }

    openMessages() {
        const messageDrawer = document.querySelector('.message-drawer');
        messageDrawer.classList.add('active');
    }

    showNotification(message, type = 'info') {
        this.notificationComponent.show(message, type);
    }

    logout() {
        localStorage.removeItem('nexus_user');
        window.location.href = 'facebok.html';
    }
}

// Component Classes
class StoryComponent {
    constructor() {
        this.stories = [];
        this.currentStoryIndex = 0;
        this.init();
    }

    init() {
        this.loadStories();
        this.setupStoryViewer();
    }

    loadStories() {
        // Simulate loading stories from API
        this.stories = [
            {
                id: 1,
                user: 'John Doe',
                image: 'https://source.unsplash.com/random/300x400?1',
                timestamp: new Date()
            },
            // Add more stories...
        ];
        this.renderStories();
    }

    renderStories() {
        const container = document.querySelector('.stories-container');
        container.innerHTML = this.stories.map(story => this.createStoryCard(story)).join('');
    }

    createStoryCard(story) {
        return `
            <div class="story-card" data-story-id="${story.id}">
                <img src="${story.image}" alt="Story by ${story.user}">
                <div class="story-info">
                    <span>${story.user}</span>
                </div>
            </div>
        `;
    }

    setupStoryViewer() {
        document.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', (e) => this.openStoryViewer(e));
        });
    }

    openStoryViewer(e) {
        const storyId = e.currentTarget.getAttribute('data-story-id');
        const story = this.stories.find(s => s.id === parseInt(storyId));
        if (story) {
            const viewer = document.querySelector('.story-viewer');
            viewer.querySelector('img').src = story.image;
            viewer.style.display = 'flex';
        }
    }
}

class ReelComponent {
    constructor() {
        this.reels = [];
        this.currentReelIndex = 0;
        this.init();
    }

    init() {
        this.loadReels();
        this.setupReelViewer();
    }

    loadReels() {
        // Simulate loading reels from API
        this.reels = [
            {
                id: 1,
                user: 'Jane Smith',
                video: 'path_to_video.mp4',
                likes: 1200,
                comments: 84
            },
            // Add more reels...
        ];
        this.renderReels();
    }

    renderReels() {
        const container = document.querySelector('.reels-container');
        container.innerHTML = this.reels.map(reel => this.createReelCard(reel)).join('');
    }

    createReelCard(reel) {
        return `
            <div class="reel-card" data-reel-id="${reel.id}">
                <div class="reel-video-container">
                    <video src="${reel.video}" loop></video>
                    <div class="reel-actions">
                        <button class="reel-action" data-action="like">
                            <i class="fas fa-heart"></i>
                            <span>${reel.likes}</span>
                        </button>
                        <button class="reel-action" data-action="comment">
                            <i class="fas fa-comment"></i>
                            <span>${reel.comments}</span>
                        </button>
                        <button class="reel-action" data-action="share">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupReelViewer() {
        document.querySelectorAll('.reel-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleReelInteraction(e));
        });
    }

    handleReelInteraction(e) {
        const action = e.target.closest('.reel-action')?.getAttribute('data-action');
        if (action) {
            switch(action) {
                case 'like':
                    this.likeReel(e);
                    break;
                case 'comment':
                    this.commentOnReel(e);
                    break;
                case 'share':
                    this.shareReel(e);
                    break;
            }
        }
    }

    likeReel(e) {
        const reelId = e.currentTarget.getAttribute('data-reel-id');
        // Implement like functionality
    }

    commentOnReel(e) {
        const reelId = e.currentTarget.getAttribute('data-reel-id');
        // Implement comment functionality
    }

    shareReel(e) {
        const reelId = e.currentTarget.getAttribute('data-reel-id');
        // Implement share functionality
    }
}

class ExploreComponent {
    constructor() {
        this.posts = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupFilters();
    }

    loadPosts() {
        // Simulate loading posts from API
        this.posts = [
            {
                id: 1,
                image: 'https://source.unsplash.com/random/600x600?1',
                likes: 1200,
                comments: 84,
                category: 'photography'
            },
            // Add more posts...
        ];
        this.renderPosts();
    }

    renderPosts() {
        const container = document.querySelector('.explore-grid');
        container.innerHTML = this.posts
            .filter(post => this.currentFilter === 'all' || post.category === this.currentFilter)
            .map(post => this.createPostCard(post))
            .join('');
    }

    createPostCard(post) {
        return `
            <div class="explore-item" data-post-id="${post.id}">
                <img src="${post.image}" alt="Explore">
                <div class="explore-overlay">
                    <i class="fas fa-heart"></i> ${post.likes}
                    <i class="fas fa-comment"></i> ${post.comments}
                </div>
            </div>
        `;
    }

    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
    }

    handleFilterChange(e) {
        const filter = e.target.getAttribute('data-filter');
        this.currentFilter = filter;
        this.renderPosts();
    }
}

class NotificationComponent {
    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

class MessageComponent {
    constructor() {
        this.messages = [];
        this.init();
    }

    init() {
        this.loadMessages();
        this.setupMessageDrawer();
    }

    loadMessages() {
        // Simulate loading messages from API
        this.messages = [
            {
                id: 1,
                user: 'John Doe',
                message: 'Hey, how are you?',
                timestamp: new Date(),
                unread: true
            },
            // Add more messages...
        ];
        this.renderMessages();
    }

    renderMessages() {
        const container = document.querySelector('.message-list');
        container.innerHTML = this.messages.map(message => this.createMessageItem(message)).join('');
    }

    createMessageItem(message) {
        return `
            <div class="message-item ${message.unread ? 'unread' : ''}" data-message-id="${message.id}">
                <div class="message-avatar">
                    <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=${message.user}" alt="${message.user}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-user">${message.user}</span>
                        <span class="message-time">${this.formatTime(message.timestamp)}</span>
                    </div>
                    <div class="message-text">${message.message}</div>
                </div>
            </div>
        `;
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    setupMessageDrawer() {
        document.querySelector('.message-drawer-close').addEventListener('click', () => {
            document.querySelector('.message-drawer').classList.remove('active');
        });
    }
}

class PostComponent {
    constructor() {
        this.posts = [];
        this.init();
    }

    init() {
        this.setupCreatePost();
        this.loadPosts();
    }

    setupCreatePost() {
        const form = document.querySelector('.create-post-form');
        form.addEventListener('submit', (e) => this.handleCreatePost(e));
    }

    handleCreatePost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Implement post creation
    }

    loadPosts() {
        // Simulate loading posts from API
        this.posts = [
            {
                id: 1,
                user: 'John Doe',
                content: 'This is a test post',
                image: 'https://source.unsplash.com/random/800x600?1',
                likes: 42,
                comments: 7,
                timestamp: new Date()
            },
            // Add more posts...
        ];
        this.renderPosts();
    }

    renderPosts() {
        const container = document.querySelector('.posts-container');
        container.innerHTML = this.posts.map(post => this.createPostCard(post)).join('');
    }

    createPostCard(post) {
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=${post.user}" alt="${post.user}" class="post-avatar">
                    <div class="post-user-info">
                        <span class="post-username">${post.user}</span>
                        <span class="post-time">${this.formatTime(post.timestamp)}</span>
                    </div>
                </div>
                <div class="post-content">
                    ${post.content}
                    ${post.image ? `<img src="${post.image}" alt="Post image">` : ''}
                </div>
                <div class="post-actions">
                    <button class="post-action" data-action="like">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="post-action" data-action="comment">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments}</span>
                    </button>
                    <button class="post-action" data-action="share">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;
    }

    formatTime(date) {
        return new Date(date).toLocaleString();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NexusApp();
});
