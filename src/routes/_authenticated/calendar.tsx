import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo, useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { useCalendarEvents, useUpdateEvent, useCreateEvent, useDeleteEvent } from '@/services/calendar.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as LucideIcons from 'lucide-react';
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({ meta: [{ title: "Calendário — BRITO ENGENHARIA" }] }),
  component: CalendarView,
});

const ICONS = [
  'StickyNote', 'Calendar', 'Clock', 'Bell', 'AlertCircle', 'CheckCircle', 
  'Star', 'Zap', 'Flag'
];

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
// Fix para Vite lidando com módulos CJS do react-big-calendar
const withDragAndDropFn = (withDragAndDrop as any).default || withDragAndDrop;
const DnDCalendar = withDragAndDropFn(BigCalendar);

function CalendarView() {
  const { data: calendarEvents = [], isLoading } = useCalendarEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteIcon, setNoteIcon] = useState('StickyNote');

  const saveNote = () => {
    if (!noteTitle.trim() || !selectedDate) return;
    
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    
    createEvent.mutate({
      title: noteTitle,
      icon: noteIcon,
      date: `${y}-${m}-${d}`,
    }, {
      onSuccess: () => {
        setIsNoteDialogOpen(false);
        setNoteTitle('');
        toast.success('Anotação salva no calendário!');
      }
    });
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent.mutate(id, {
      onSuccess: () => toast.success('Anotação removida.')
    });
  };

  const handleEventDrop = ({ event, start }: any) => {
    try {
      const y = start.getFullYear();
      const m = String(start.getMonth() + 1).padStart(2, '0');
      const d = String(start.getDate()).padStart(2, '0');
      const newDateStr = `${y}-${m}-${d}`;

      updateEvent.mutate({
        id: event.id,
        data: { date: newDateStr }
      }, {
        onSuccess: () => toast.success('Anotação movida.')
      });
    } catch (error) {
      toast.error('Erro ao mover evento.');
    }
  };

  const events = useMemo(() => {
    return calendarEvents.map((note) => {
      const [year, month, day] = note.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return {
        id: note.id,
        title: note.title,
        start: date,
        end: date,
        allDay: true,
        resource: { type: 'note', data: note },
      };
    });
  }, [calendarEvents]);

  const eventPropGetter = (event: any) => {
    return {
      className: 'rounded text-xs font-semibold border-0 overflow-hidden bg-accent/80 text-accent-foreground border-l-4 border-accent-foreground/50 shadow-sm',
      style: { backgroundColor: 'transparent', color: 'inherit' }
    };
  };

  const CustomEvent = ({ event }: any) => {
    const IconComp = (LucideIcons as any)[event.resource.data.icon] || LucideIcons.StickyNote;
    return (
      <div className="flex items-center gap-1.5 group relative w-full h-full py-1 px-1.5 overflow-hidden">
        <IconComp className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate flex-1 text-left">{event.title}</span>
        <button 
          onClick={(e) => handleDeleteNote(event.id, e)}
          className="absolute right-0 top-0 bottom-0 px-2 bg-accent hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center z-10"
          title="Excluir anotação"
        >
          <LucideIcons.X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col p-4 sm:p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Calendário da Obra</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualize e crie anotações na sua agenda diária.</p>
      </div>

      <div className="flex-1 min-h-[500px] md:min-h-[600px] bg-card rounded-xl border border-border p-2 md:p-4 shadow-sm overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
             <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-full calendar-container">
            <style dangerouslySetInnerHTML={{__html: `
              .calendar-container .rbc-calendar {
                font-family: inherit;
                min-height: 600px;
              }
              .calendar-container .rbc-header {
                padding: 8px;
                font-weight: 600;
                border-bottom: 1px solid hsl(var(--border));
                border-left: 1px solid hsl(var(--border));
              }
              .calendar-container .rbc-month-view,
              .calendar-container .rbc-time-view,
              .calendar-container .rbc-agenda-view {
                border: 1px solid hsl(var(--border));
                border-radius: 0.5rem;
                overflow: hidden;
                background-color: hsl(var(--card));
              }
              .calendar-container .rbc-day-bg {
                border-left: 1px solid hsl(var(--border));
              }
              .calendar-container .rbc-month-row {
                border-top: 1px solid hsl(var(--border));
              }
              .calendar-container .rbc-off-range-bg {
                background-color: hsl(var(--muted) / 0.3);
              }
              .calendar-container .rbc-today {
                background-color: hsl(var(--accent) / 0.3);
              }
              .calendar-container .rbc-event {
                padding: 0;
                background: none;
              }
              .calendar-container .rbc-button-link {
                color: hsl(var(--foreground));
              }
              .calendar-container .rbc-toolbar {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
                align-items: center;
                justify-content: space-between;
              }
              .calendar-container .rbc-toolbar button {
                color: hsl(var(--foreground));
                border-color: hsl(var(--border));
              }
              .calendar-container .rbc-toolbar button:active,
              .calendar-container .rbc-toolbar button.rbc-active {
                background-color: hsl(var(--accent));
                color: hsl(var(--accent-foreground));
                border-color: hsl(var(--border));
              }
              .calendar-container .rbc-toolbar button:hover {
                background-color: hsl(var(--accent) / 0.5);
              }
              
              @media (max-width: 768px) {
                .calendar-container .rbc-toolbar {
                  flex-direction: column;
                  gap: 1rem;
                }
                .calendar-container .rbc-toolbar .rbc-toolbar-label {
                  order: -1;
                  font-size: 1.25rem;
                  font-weight: bold;
                }
                .calendar-container .rbc-toolbar .rbc-btn-group {
                  width: 100%;
                  display: flex;
                  justify-content: center;
                }
                .calendar-container .rbc-toolbar .rbc-btn-group button {
                  flex: 1;
                  padding: 4px 8px;
                  font-size: 0.8rem;
                }
                .calendar-container .rbc-event-content {
                  font-size: 0.6rem;
                }
              }
            `}} />
            <div className="h-full">
              <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture={'pt-BR'}
                defaultView="month"
                views={['month', 'agenda']}
                style={{ height: '100%' }}
                eventPropGetter={eventPropGetter}
                components={{
                  event: CustomEvent,
                }}
                selectable={true}
                draggableAccessor={() => true}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventDrop}
                resizable
                onSelectSlot={(slotInfo) => {
                  setSelectedDate(slotInfo.start);
                  setNoteTitle('');
                  setIsNoteDialogOpen(true);
                }}
                messages={{
                  next: 'Próximo',
                  previous: 'Anterior',
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia',
                  agenda: 'Agenda',
                  date: 'Data',
                  time: 'Hora',
                  event: 'Evento',
                  noEventsInRange: 'Nenhum evento neste período.',
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Anotação no Calendário</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-12 h-10 p-0 shrink-0">
                  {React.createElement((LucideIcons as any)[noteIcon] || LucideIcons.StickyNote, { className: "w-5 h-5" })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-2" align="start">
                <div className="grid grid-cols-6 gap-1 h-[240px] overflow-y-auto scrollbar-hide pr-1">
                  {ICONS.map((iconName) => {
                    const Icon = (LucideIcons as any)[iconName];
                    if (!Icon) return null;
                    return (
                      <button
                        key={iconName}
                        onClick={() => setNoteIcon(iconName)}
                        className={`p-2 rounded-md flex items-center justify-center hover:bg-accent ${noteIcon === iconName ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                        title={iconName}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Ex: Pagar conta de luz..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveNote();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveNote}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
