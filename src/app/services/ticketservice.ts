const ticketCodes = {
    'Football Tournament': 'FT2024-8765',
    'Open Mic Night': 'OMN2024-4321',
    'Food Carnival': 'FC2024-9876',
    'Dance Event': 'DE2024-5432',
    'Basketball League': 'BL2024-1098',
    'DJ Night': 'DJ2024-7654'
  };
  
  interface Ticket {
    ticketCode: string;
    eventTitle: string;
    userEmail: string;
    purchaseDate: string;
    userName: string;
  }
  
  export const saveTicketData = (eventTitle: string, userEmail: string) => {
    try {
      const ticketCode = ticketCodes[eventTitle];
      
      // Create ticket object
      const ticket: Ticket = {
        ticketCode,
        eventTitle,
        userEmail,
        userName: userEmail.split('@')[0], // Simple way to get a name from email
        purchaseDate: new Date().toISOString()
      };
  
      // Get existing tickets from localStorage
      const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      existingTickets.push(ticket);
      
      // Save to localStorage
      localStorage.setItem('tickets', JSON.stringify(existingTickets));
  
      return ticketCode;
    } catch (error) {
      console.error('Error saving ticket:', error);
      return ticketCodes[eventTitle]; // Return code even if storage fails
    }
  };