export const ADMIN_CREDENTIALS = {
  email: 'yavuzobuz@hotmail.com',
  password: 'Ata43han23'
};

export function isAdminEmail(email: string): boolean {
  return email === ADMIN_CREDENTIALS.email;
}

export function validateAdminLogin(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

export function checkAdminPermission(userEmail: string | null): boolean {
  if (!userEmail) return false;
  return isAdminEmail(userEmail);
} 