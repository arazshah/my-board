<template>
  <button 
    :class="['base-button', variant, { loading }]" 
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'danger', 'outline', 'text'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  outline: none;
  
  &.primary {
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 114, 255, 0.3);
    
    &:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(0, 114, 255, 0.4);
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background-color: var(--secondary-color);
    color: var(--dark-color);
  }
  
  &.danger {
    background-color: var(--danger-color);
    color: white;
  }
  
  &.outline {
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    
    &:hover:not(:disabled) {
      background-color: rgba(0, 114, 255, 0.1);
    }
  }
  
  &.text {
    background: transparent;
    color: var(--primary-color);
    padding: 8px 16px;
    
    &:hover:not(:disabled) {
      background-color: rgba(0, 114, 255, 0.1);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.loading {
    cursor: wait;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 