import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core';

interface CalendarEvent {
    title: string;
    professor: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
}

interface AcademicCalendarProps {
    events: CalendarEvent[];
    mobileOnly?: boolean;
}

const AcademicCalendar: React.FC<AcademicCalendarProps> = ({ events, mobileOnly = false }) => {
    return (
        <div style={{
            borderLeft: "4px solid #038b94",
            borderRadius: "5px",
          
            ...(mobileOnly && { width: 'fit-content' })
        }}>
       
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={false}
                allDaySlot={false}
                height="auto"
                slotDuration="01:30:00"
                slotLabelInterval="01:30:00"
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }}
                events={(fetchInfo, successCallback) => {
                    const processedEvents: EventInput[] = events.map(event => ({
                        ...event,
                        extendedProps: {
                            professor: event.professor
                        },
                        startRecur: fetchInfo.startStr,
                        endRecur: fetchInfo.endStr
                    }));
                    successCallback(processedEvents);
                }}
                dayHeaderFormat={{ weekday: 'short' }}
                weekends={false}
                editable={false}
                selectable={false}
                dayCellClassNames={(arg) => arg.isThu ? '' : 'normal-day'}
                eventDidMount={(info) => {
                    info.el.style.background = 'linear-gradient(150deg, #038b94 0%, #036956 100%)';
                }}
                eventContent={(arg) => (
                    <div style={{
                        padding: '2px',
                        fontSize: mobileOnly ? '9px' : '14px',
                        width: 'fit-content',
                        height: mobileOnly ? '3rem' : '6rem',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        display: 'flex',
                        flexDirection: 'column',
                      
                        lineHeight: '1.3'
                    }}>
                        <div><strong>{arg.event.title}</strong></div>
                        <div style={{ fontSize: '0.8em' }}>
                            {arg.event.extendedProps.professor}
                        </div>
                    </div>
                )}
                dayHeaderContent={(arg) => (
                    <div style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        padding: '16px 0',
                        textAlign: 'center'
                    }}>
                        {arg.text}
                    </div>
                )}
                slotLabelContent={(arg) => (
                    <div style={{
                        padding: mobileOnly ? '2px' : '8px',
                        fontSize: mobileOnly ? '9px' : '14px',
                        height: mobileOnly ? '3rem' : '6rem',
                        wordBreak: 'break-word',
                        lineHeight: '1.2',
                    }}>
                        {arg.text}
                    </div>
                )}
            />
        </div>
    );
};

export default AcademicCalendar;