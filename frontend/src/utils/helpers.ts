export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const formatted = date.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatted.replace(/\//g, '-').replace(', ', ' ');
};

export const extractTime = (dateString: string): string => {
  const date = new Date(dateString);

  const formatted = date.toLocaleString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatted.replace(/\//g, '-').replace(', ', ' ');
};
