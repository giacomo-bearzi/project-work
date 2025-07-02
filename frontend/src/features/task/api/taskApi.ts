import api from '../../../utils/axios.ts';

const ENDPOINT = '/tasks';

export const getTaskByLineId = async (lineId: string, status?: string, type?: string ) => {
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINT}/line/${lineId}?${queryString}` : `${ENDPOINT}/line/${lineId}`;
    
    const response = await api.get(url);
    return response.data;
  };