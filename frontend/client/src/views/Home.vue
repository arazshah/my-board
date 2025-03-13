<template>
  <div class="home">
    <app-header />
    
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Manage Your Tasks with Ease</h1>
          <p>A simple, intuitive task management system to boost your productivity.</p>
          <div class="hero-actions">
            <router-link to="/login">
              <base-button>Get Started</base-button>
            </router-link>
            <a href="#features">
              <base-button variant="outline">Learn More</base-button>
            </a>
          </div>
        </div>
        <div class="hero-image">
          <img src="@/assets/images/hero-image.svg" alt="Task Management" />
        </div>
      </div>
    </section>
    
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2>Key Features</h2>
          <p>Everything you need to stay organized and productive</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <h3>Task Management</h3>
            <p>Create, organize, and track your tasks with ease. Set priorities, deadlines, and categories.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-project-diagram"></i>
            </div>
            <h3>Project Organization</h3>
            <p>Group related tasks into projects. Track progress and manage team collaboration.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <h3>Calendar View</h3>
            <p>Visualize your schedule with a comprehensive calendar view. Never miss a deadline.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>Progress Tracking</h3>
            <p>Monitor your productivity with detailed statistics and progress reports.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3>Notifications</h3>
            <p>Stay updated with timely reminders and notifications about your tasks and projects.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <h3>Team Collaboration</h3>
            <p>Share projects, assign tasks, and collaborate seamlessly with your team members.</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who are already boosting their productivity with our platform.</p>
          <router-link to="/login">
            <base-button>Sign Up Now</base-button>
          </router-link>
        </div>
      </div>
    </section>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="@/assets/images/logo.svg" alt="Logo" />
            <span>My-Board</span>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">Updates</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Team</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Guides</a></li>
                <li><a href="#">API Docs</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} My-Board. All rights reserved.</p>
          <div class="social-links">
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
            <a href="#"><i class="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';

export default {
  name: 'Home',
  components: {
    AppHeader,
    BaseButton
  }
}
</script>

<style lang="scss" scoped>
.home {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .hero {
    padding: 100px 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    
    .container {
      display: flex;
      align-items: center;
      
      @media (max-width: 992px) {
        flex-direction: column;
        text-align: center;
      }
    }
    
    .hero-content {
      flex: 1;
      
      h1 {
        font-size: 48px;
        font-weight: 700;
        margin: 0 0 20px;
        color: var(--dark-color);
      }
      
      p {
        font-size: 18px;
        color: #666;
        margin-bottom: 30px;
        max-width: 500px;
        
        @media (max-width: 992px) {
          margin-left: auto;
          margin-right: auto;
        }
      }
      
      .hero-actions {
        display: flex;
        gap: 15px;
        
        @media (max-width: 992px) {
          justify-content: center;
        }
        
        @media (max-width: 576px) {
          flex-direction: column;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }
      }
    }
    
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 15px;
      color: var(--dark-color);
    }
    
    p {
      font-size: 18px;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .features {
    padding: 100px 0;
    background-color: white;
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      
      @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }
    
    .feature-card {
      background-color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      padding: 30px;
      transition: var(--transition);
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }
      
      .feature-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        
        i {
          font-size: 24px;
          color: white;
        }
      }
      
      h3 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 15px;
        color: var(--dark-color);
      }
      
      p {
        font-size: 16px;
        color: #666;
        margin: 0;
      }
    }
  }
  
  .cta {
    padding: 80px 0;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
    
    .cta-content {
      text-align: center;
      color: white;
      
      h2 {
        font-size: 36px;
        font-weight: 700;
        margin: 0 0 15px;
      }
      
      p {
        font-size: 18px;
        margin: 0 0 30px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
  
  .footer {
    background-color: #2c3e50;
    color: white;
    padding: 80px 0 30px;
    
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 50px;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      margin-right: 100px;
      margin-bottom: 30px;
      
      img {
        height: 40px;
        margin-right: 10px;
      }
      
      span {
        font-size: 24px;
        font-weight: 700;
      }
    }
    
    .footer-links {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      
      .footer-column {
        flex: 1;
        min-width: 160px;
        margin-bottom: 30px;
        
        h4 {
          font-size: 18px;
          margin: 0 0 20px;
        }
        
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          
          li {
            margin-bottom: 10px;
            
            a {
              color: #a4b0be;
              text-decoration: none;
              transition: var(--transition);
              
              &:hover {
                color: white;
              }
            }
          }
        }
      }
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      
      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }
      
      p {
        margin: 0;
        color: #a4b0be;
        
        @media (max-width: 768px) {
          margin-bottom: 20px;
        }
      }
      
      .social-links {
        display: flex;
        gap: 15px;
        
        a {
          color: #a4b0be;
          font-size: 20px;
          transition: var(--transition);
          
          &:hover {
            color: white;
          }
        }
      }
    }
  }
}
</style> 