/* Input sizes */
.input-sm { height: 36px; padding: 0 10px; font-size: 14px; }
.input-md { height: 40px; padding: 0 12px; font-size: 14px; }
.input-lg { height: 44px; padding: 0 14px; font-size: 16px; }

/* States */
.input:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary) / 0.2;
}
.input-error {
  border-color: var(--color-error);
}
.input-error:focus-visible {
  box-shadow: 0 0 0 2px var(--color-error) / 0.2;
}
.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error message */
.input-error-msg {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-error);
  font-size: 13px;
  margin-top: 4px;
}