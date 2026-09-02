import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  useNotes, 
  useCreateNote, 
  useUpdateNote, 
  useDeleteNote, 
  useToggleNotePin, 
  useToggleNoteArchive
} from '@/services/notes.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  FileText, 
  MoreVertical, 
  Pin, 
  PinOff, 
  Archive, 
  ArchiveRestore, 
  Trash2,
  Menu,
  Lightbulb, Rocket, Target, Book, PenTool, Sparkles, BarChart2
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const Route = createFileRoute("/_authenticated/notes")({
  head: () => ({ meta: [{ title: "Anotações — BRITO ENGENHARIA" }] }),
  component: NotesPage,
});

const ICONS = {
  FileText, Lightbulb, Rocket, Target, Book, PenTool, Sparkles, BarChart2
};

const NoteIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = ICONS[name as keyof typeof ICONS] || FileText;
  return <Icon className={className} />;
};

function NotesPage() {
  const queryClient = useQueryClient();
  
  // Realtime
  useEffect(() => {
    const channel = supabase.channel('notes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notes'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Data
  const { data: notes = [], isLoading } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const togglePin = useToggleNotePin();
  const toggleArchive = useToggleNoteArchive();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
  // Editor State
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorIcon, setEditorIcon] = useState('FileText');
  const [isSaving, setIsSaving] = useState(false);

  // Derived state
  const selectedNote = useMemo(() => 
    notes.find(n => n.id === selectedNoteId),
  [notes, selectedNoteId]);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Sync selected note to editor state when it changes
  useEffect(() => {
    if (selectedNote && selectedNote.id !== editingNoteId) {
      setEditorTitle(selectedNote.title);
      setEditorContent((selectedNote.content as any)?.text || '');
      setEditorIcon(selectedNote.icon);
      setEditingNoteId(selectedNote.id);
    } else if (!selectedNote) {
      setEditorTitle('');
      setEditorContent('');
      setEditorIcon('FileText');
      setEditingNoteId(null);
    }
  }, [selectedNote, editingNoteId]);

  // Debounced Auto-save
  useEffect(() => {
    if (editingNoteId && selectedNote) {
      const handler = setTimeout(() => {
        const selectedText = (selectedNote.content as any)?.text || '';
        if (
          editorTitle !== selectedNote.title || 
          editorContent !== selectedText ||
          editorIcon !== selectedNote.icon
        ) {
          setIsSaving(true);
          updateNote.mutate({
            id: editingNoteId,
            data: {
              title: editorTitle,
              content: { text: editorContent },
              icon: editorIcon
            }
          }, {
            onSuccess: () => setIsSaving(false),
            onError: () => {
              setIsSaving(false);
              toast.error('Erro ao salvar anotação');
            }
          });
        }
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [editorTitle, editorContent, editorIcon, editingNoteId, selectedNote, updateNote]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    let result = notes;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(lowerQuery));
    }

    if (activeTab === 'pinned') {
      result = result.filter(n => n.pinned && !n.archived);
    } else if (activeTab === 'archived') {
      result = result.filter(n => n.archived);
    } else {
      result = result.filter(n => !n.archived);
    }

    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [notes, searchQuery, activeTab]);

  const handleCreateNote = () => {
    createNote.mutate({
      title: 'Nova Anotação',
      content: { text: '' },
      icon: 'FileText',
    }, {
      onSuccess: (newNote) => {
        setSelectedNoteId(newNote.id);
      }
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border md:bg-transparent">
      <div className="p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Anotações</h1>
          <Button size="icon" className="bg-primary rounded-full h-10 w-10" onClick={handleCreateNote}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Buscar anotações..."
            className="pl-9 bg-background border-border/50 rounded-xl h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">Todas</TabsTrigger>
            <TabsTrigger value="pinned" className="rounded-lg">Fixadas</TabsTrigger>
            <TabsTrigger value="archived" className="rounded-lg">Arquivadas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-6">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all border group relative overflow-hidden ${
                selectedNoteId === note.id 
                  ? 'bg-primary/10 border-primary/20 shadow-sm' 
                  : 'bg-card hover:bg-accent border-transparent'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedNoteId === note.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <NoteIcon name={note.icon} className="h-5 w-5 shrink-0" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold truncate text-[15px]">{note.title || 'Sem título'}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {note.pinned && <Pin className="h-3 w-3 text-primary fill-primary/20" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {format(new Date(note.updated_at), "dd/MM", { locale: ptBR })}
                  </span>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="absolute right-2 top-1/2 -translate-y-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-full shadow-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => togglePin.mutate({ id: note.id, pinned: !note.pinned })} className="rounded-lg">
                      {note.pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                      {note.pinned ? 'Desafixar' : 'Fixar no topo'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleArchive.mutate({ id: note.id, archived: !note.archived })} className="rounded-lg">
                      {note.archived ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                      {note.archived ? 'Desarquivar' : 'Arquivar'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg" onClick={() => {
                        deleteNote.mutate(note.id);
                        if (selectedNoteId === note.id) setSelectedNoteId(null);
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Apagar Nota
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 opacity-40" />
              </div>
              <p className="font-medium">Nenhuma anotação</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex flex-1 w-full h-full min-h-[calc(100vh-65px)] bg-background overflow-hidden relative">
      <div className={`
        ${selectedNote ? 'hidden lg:flex' : 'flex'}
        flex-col w-full lg:w-[380px] flex-shrink-0 bg-muted/30 border-r border-border z-10
      `}>
        <SidebarContent />
      </div>

      <div className={`
        ${selectedNote ? 'flex' : 'hidden lg:flex'}
        flex-1 flex-col min-w-0 bg-background relative
      `}>
        {selectedNote ? (
          <div className="flex-1 flex flex-col w-full h-full">
            <div className="lg:hidden flex items-center justify-between p-3 border-b border-border bg-background sticky top-0 z-10">
              <Button variant="ghost" onClick={() => setSelectedNoteId(null)} className="text-primary hover:bg-primary/10 -ml-2 rounded-xl">
                <Menu className="h-5 w-5 mr-1" />
                Voltar
              </Button>
              <span className="text-xs font-semibold text-muted-foreground truncate px-4">{format(new Date(selectedNote.updated_at), "dd/MM HH:mm")}</span>
            </div>

            <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
              <div className="mb-6 flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl">
                      <NoteIcon name={editorIcon} className="h-6 w-6 text-primary" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-3 rounded-2xl" align="start">
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(ICONS).map((iconName) => (
                        <Button
                          key={iconName} variant="ghost"
                          onClick={() => setEditorIcon(iconName)}
                          className={`h-12 w-12 p-0 rounded-xl transition-all ${editorIcon === iconName ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        >
                          <NoteIcon name={iconName} className="h-5 w-5" />
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Input 
                  value={editorTitle} 
                  onChange={e => setEditorTitle(e.target.value)} 
                  className="text-2xl font-bold h-14 bg-transparent border-transparent focus-visible:ring-0 px-0 hover:bg-accent/50 rounded-xl shadow-none"
                  placeholder="Título da anotação"
                />
              </div>
              
              <Textarea
                className="flex-1 min-h-[500px] resize-none text-base border-transparent focus-visible:ring-0 px-0 shadow-none bg-transparent leading-relaxed"
                placeholder="Escreva sua anotação aqui..."
                value={editorContent}
                onChange={e => setEditorContent(e.target.value)}
              />
              
              {isSaving && (
                <div className="fixed bottom-6 right-6 text-xs text-muted-foreground animate-pulse">
                  Salvando...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <FileText className="h-16 w-16 opacity-20 mb-4" />
            <p>Selecione uma anotação ou crie uma nova</p>
          </div>
        )}
      </div>
    </div>
  );
}
