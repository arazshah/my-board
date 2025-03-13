<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <div class="actions">
        <router-link to="/">
          <base-button>Go to Home</base-button>
        </router-link>
        <base-button variant="outline" @click="goBack">Go Back</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue';

export default {
  name: 'NotFound',
  components: {
    BaseButton
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  .not-found-content {
    text-align: center;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--card-shadow);
    padding: 60px;
    max-width: 500px;
    
    .error-code {
      font-size: 120px;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1;
      margin-bottom: 20px;
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    h1 {
      font-size: 32px;
      margin: 0 0 20px;
      color: var(--dark-color);
    }
    
    p {
      font-size: 16px;
      color: var(--gray-color);
      margin-bottom: 30px;
    }
    
    .actions {
      display: flex;
      justify-content: center;
      gap: 15px;
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    .not-found-content {
      padding: 40px 20px;
      margin: 0 20px;
      
      .error-code {
        font-size: 100px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .actions {
        flex-direction: column;
      }
    }
  }
}
</style> 