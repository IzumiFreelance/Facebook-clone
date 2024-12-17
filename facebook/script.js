// User Management
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const defaultAvatar = 'https://api.dicebear.com/6.x/avataars/svg?seed=';

// Sample data structure
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let communities = [
    { id: 1, name: 'Tech Innovators', members: 15200, icon: 'https://api.dicebear.com/6.x/identicon/svg?seed=Tech' },
    { id: 2, name: 'Digital Artists', members: 8700, icon: 'https://api.dicebear.com/6.x/identicon/svg?seed=Art' },
    { id: 3, name: 'Entrepreneurs', members: 12300, icon: 'https://api.dicebear.com/6.x/identicon/svg?seed=Business' }
];
let events = [
    { id: 1, name: 'Global Innovation Summit', date: 'Tomorrow, 2:00 PM', attending: 156 },
    { id: 2, name: 'Creative Workshop', date: 'Saturday, 11:00 AM', attending: 89 },
    { id: 3, name: 'Tech Meetup', date: 'Next Week, 3:00 PM', attending: 234 }
];

// Additional Sample Data
const spaces = [
    { id: 1, name: 'Gaming Lounge', participants: 24, type: 'gaming', icon: '🎮' },
    { id: 2, name: 'Music Club', participants: 12, type: 'music', icon: '🎵' },
    { id: 3, name: 'Book Club', participants: 8, type: 'books', icon: '📚' }
];

const trendingTopics = [
    { id: 1, topic: '#TechNews', posts: 15200, trending: true },
    { id: 2, topic: '#Gaming', posts: 8700, trending: true },
    { id: 3, topic: '#Music', posts: 12300, trending: false }
];

// Authentication Functions
function handleLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (email && password) {
        // In a real app, this would be an API call
        currentUser = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            avatar: defaultAvatar + email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'facebok.html';
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function checkAuth() {
    if (!currentUser && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Post Management
function createPost(content, type = 'text', mediaUrl = null) {
    const post = {
        id: Date.now(),
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        content: content,
        type: type,
        mediaUrl: mediaUrl,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        shares: 0,
        liked: false
    };
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    return post;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
    if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
    return date.toLocaleDateString();
}

function renderPosts() {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;

    feedContainer.innerHTML = posts.map(post => `
        <div class="post" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${post.authorAvatar}" alt="${post.author}" class="post-profile-pic">
                <div class="post-info">
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${formatTimestamp(post.timestamp)}</div>
                </div>
                <div class="post-menu">
                    <button onclick="showPostMenu(${post.id})">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
                ${post.mediaUrl ? `<img src="${post.mediaUrl}" alt="Post media" class="post-media">` : ''}
                ${post.type === 'poll' ? renderPoll(post) : ''}
            </div>
            <div class="post-stats">
                <span>${post.likes} likes</span>
                <span>${post.comments.length} comments</span>
                <span>${post.shares} shares</span>
            </div>
            <div class="post-actions">
                <button class="interaction-button ${post.liked ? 'liked' : ''}" onclick="handleLike(${post.id})">
                    <i class="fas fa-heart"></i> Like
                </button>
                <button class="interaction-button" onclick="focusComment(${post.id})">
                    <i class="fas fa-comment"></i> Comment
                </button>
                <button class="interaction-button" onclick="handleShare(${post.id})">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
            <div class="comments-section">
                ${renderComments(post.comments)}
                <div class="comment-input-container">
                    <img src="${currentUser?.avatar}" alt="Your avatar" class="comment-avatar">
                    <input type="text" 
                           class="comment-input" 
                           placeholder="Write a comment..."
                           onkeypress="handleCommentInput(event, ${post.id})">
                </div>
            </div>
        </div>
    `).join('');
}

// Post Interactions
function handleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }
}

function handleComment(postId, content) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            id: Date.now(),
            author: currentUser.name,
            authorAvatar: currentUser.avatar,
            content: content,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }
}

function handleShare(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.shares++;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
        // In a real app, this would open a share dialog
        alert('Sharing functionality would open a dialog here');
    }
}

function handleCommentInput(event, postId) {
    if (event.key === 'Enter' && event.target.value.trim()) {
        handleComment(postId, event.target.value.trim());
        event.target.value = '';
    }
}

// Media Upload
function handleMediaUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createPost('', 'image', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Poll Creation
function createPoll(question, options) {
    const pollPost = {
        id: Date.now(),
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        content: question,
        type: 'poll',
        options: options.map(opt => ({ text: opt, votes: 0 })),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        shares: 0
    };
    posts.unshift(pollPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
}

function handlePollVote(postId, optionIndex) {
    const post = posts.find(p => p.id === postId);
    if (post && post.type === 'poll') {
        post.options[optionIndex].votes++;
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }
}

// Search Functionality
function handleSearch(query) {
    query = query.toLowerCase();
    const results = posts.filter(post =>
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
    );
    renderPosts(results);
}

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Initialize UI
    renderPosts();
    
    // Set up event listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const postInput = document.getElementById('post-input');
    const postButton = document.getElementById('post-button');
    if (postInput && postButton) {
        postButton.addEventListener('click', () => {
            const content = postInput.value.trim();
            if (content) {
                createPost(content);
                postInput.value = '';
            }
        });
    }

    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Media upload button
    const mediaButton = document.querySelector('.action-button i.fa-image')?.parentElement;
    if (mediaButton) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleMediaUpload);
        mediaButton.appendChild(fileInput);
        mediaButton.addEventListener('click', () => fileInput.click());
    }

    // Poll creation button
    const pollButton = document.querySelector('.action-button i.fa-poll')?.parentElement;
    if (pollButton) {
        pollButton.addEventListener('click', () => {
            const question = prompt('Enter your poll question:');
            if (question) {
                const options = [];
                for (let i = 1; i <= 4; i++) {
                    const option = prompt(`Enter option ${i} (or cancel to finish):`);
                    if (option) {
                        options.push(option);
                    } else {
                        break;
                    }
                }
                if (options.length >= 2) {
                    createPoll(question, options);
                }
            }
        });
    }
});

// Helper Functions
function renderComments(comments) {
    return comments.map(comment => `
        <div class="comment">
            <img src="${comment.authorAvatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.content}</div>
                <div class="comment-time">${formatTimestamp(comment.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function renderPoll(post) {
    const totalVotes = post.options.reduce((sum, opt) => sum + opt.votes, 0);
    return `
        <div class="poll-container">
            <div class="poll-question">${post.content}</div>
            ${post.options.map((option, index) => {
                const percentage = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
                return `
                    <div class="poll-option" onclick="handlePollVote(${post.id}, ${index})">
                        <div class="poll-option-text">${option.text}</div>
                        <div class="poll-option-bar" style="width: ${percentage}%"></div>
                        <div class="poll-option-percentage">${percentage}%</div>
                    </div>
                `;
            }).join('')}
            <div class="poll-total">${totalVotes} votes</div>
        </div>
    `;
}

function showPostMenu(postId) {
    // In a real app, this would show a dropdown menu with options
    alert('Post menu would show options like Edit, Delete, Report, etc.');
}

// Responsive Navigation
function toggleMobileMenu() {
    const sidebar = document.querySelector('.left-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show-mobile');
    }
}

// Initialize the app
if (typeof window !== 'undefined') {
    checkAuth();
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Voice Chat Room Functions
function joinVoiceRoom(roomId) {
    const room = spaces.find(s => s.id === roomId);
    if (room) {
        // In a real app, this would connect to a WebRTC service
        showNotification(`Joined ${room.name}`, 'success');
    }
}

// Live Streaming Functions
function startLiveStream() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            document.querySelector('.live-stream-container').appendChild(videoElement);
            videoElement.play();
            showNotification('Live stream started!', 'success');
        })
        .catch(err => showNotification('Could not start stream: ' + err.message, 'error'));
}

// Enhanced Post Creation
function createEnhancedPost(content, options = {}) {
    const post = {
        ...createPost(content, options.type, options.mediaUrl),
        poll: options.poll || null,
        feeling: options.feeling || null,
        location: options.location || null,
        tags: options.tags || [],
        privacy: options.privacy || 'public',
        backgroundStyle: options.backgroundStyle || null
    };
    
    renderPosts();
    return post;
}

// Emoji Picker
function toggleEmojiPicker(target) {
    const picker = document.querySelector('.emoji-picker');
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
}

// GIF Selector
function toggleGifSelector(target) {
    const selector = document.querySelector('.gif-selector');
    selector.style.display = selector.style.display === 'none' ? 'block' : 'none';
}

// Enhanced Notifications
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
}

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Initialize dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Setup event listeners for new features
    document.querySelector('.theme-toggle')?.addEventListener('click', toggleDarkMode);
    
    // Initialize voice rooms
    document.querySelectorAll('.voice-chat-room').forEach(room => {
        room.addEventListener('click', () => joinVoiceRoom(parseInt(room.dataset.roomId)));
    });
    
    // Setup post creation enhancements
    document.querySelector('.create-post input')?.addEventListener('click', () => {
        document.querySelector('.create-post-modal').style.display = 'block';
    });
    
    // Initialize feed filters
    document.querySelectorAll('.feed-filters button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.feed-filters button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // In a real app, this would filter the feed content
        });
    });
});
