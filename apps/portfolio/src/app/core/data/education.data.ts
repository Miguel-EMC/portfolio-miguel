export interface Education {
  id: string;
  status: 'studying' | 'completed' | 'certified';
  icon: string;
}
export const educationItems: Education[] = [
  { id: 'computer-engineering', status: 'studying', icon: 'bi-mortarboard' },
  { id: 'software-development', status: 'completed', icon: 'bi-code-slash' },
  { id: 'nde', status: 'certified', icon: 'bi-shield-check' },
];
