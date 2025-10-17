import React, { useEffect } from 'react';

const GoogleCalendarRedirect = () => {
  useEffect(() => {
    // Redirect to Google Calendar
    window.location.href = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2B-xvZKl6KLUb7H0jvcNNBNdXAhGO9X2G0Qwl0DOMBFDzykmYM1Kv0MOHSs0vPrWkUZTDyy2QQ';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#527ceb] to-[#6762b3]">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirigiendo a Google Calendar...</h2>
        <p className="text-white/80">Serás redirigido al sistema de citas en unos segundos.</p>
      </div>
    </div>
  );
};

export default GoogleCalendarRedirect;