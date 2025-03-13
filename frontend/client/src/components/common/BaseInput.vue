<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
      <slot name="icon"></slot>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="hint" class="hint-text">{{ hint }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    id: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'blur']
}
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
    color: var(--dark-color);
  }
  
  .input-wrapper {
    position: relative;
    
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: var(--border-radius);
      font-size: 14px;
      transition: var(--transition);
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(0, 114, 255, 0.1);
      }
      
      &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
    }
  }
  
  &.has-error {
    input {
      border-color: var(--danger-color);
    }
  }
  
  .error-message {
    color: var(--danger-color);
    font-size: 12px;
    margin-top: 5px;
  }
  
  .hint-text {
    color: var(--gray-color);
    font-size: 12px;
    margin-top: 5px;
  }
}
</style> 