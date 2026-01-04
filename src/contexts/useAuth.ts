// Re-export useAuth hook to fix Fast Refresh warning
// This file exists because Fast Refresh requires files to only export components OR only non-components
export { useAuth } from './AuthContext';
