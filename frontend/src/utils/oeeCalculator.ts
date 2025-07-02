// Helper function to get status color
export const getOEEStatusColor = (status: 'excellent' | 'good' | 'critical'): string => {
  switch (status) {
    case 'excellent':
      return '#4CAF50'; // Green
    case 'good':
      return '#FF9800'; // Orange
    case 'critical':
      return '#F44336'; // Red
    default:
      return '#757575'; // Gray
  }
};

// Helper function to get status text
export const getOEEStatusText = (status: 'excellent' | 'good' | 'critical'): string => {
  switch (status) {
    case 'excellent':
      return 'Ottimo livello';
    case 'good':
      return 'Accettabile ma migliorabile';
    case 'critical':
      return 'Critico, da intervenire';
    default:
      return 'Non disponibile';
  }
}; 