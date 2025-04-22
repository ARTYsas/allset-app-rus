
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Task } from '@/types';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskCreate: () => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const KanbanBoard = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskCreate, 
  onTaskDelete, 
  onTaskEdit 
}: KanbanBoardProps) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const columns = [
    { id: 'backlog', title: 'Бэклог' },
    { id: 'todo', title: 'К выполнению' },
    { id: 'in-progress', title: 'В работе' },
    { id: 'review', title: 'На проверке' },
    { id: 'done', title: 'Готово' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back to its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the task that was dragged
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Update the task's status
    const updatedTask = {
      ...task,
      status: destination.droppableId as 'backlog' | 'todo' | 'in-progress' | 'review' | 'done',
      updatedAt: new Date(),
    };

    onTaskUpdate(updatedTask);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-6">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-72">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {column.title}
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {getTasksByStatus(column.id).length}
                    </span>
                  </CardTitle>
                  {column.id === 'todo' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onTaskCreate} 
                      className="h-8 w-8"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-2 flex-1 overflow-y-auto">
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px]"
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 p-3 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'rotate-1 opacity-90' : ''
                              } ${
                                activeTaskId === task.id ? 'ring-2 ring-blue-500' : ''
                              }`}
                              onClick={() => setActiveTaskId(task.id)}
                            >
                              <div className="text-sm font-medium mb-1">{task.title}</div>
                              {task.description && (
                                <div className="text-xs text-gray-500 mb-2 line-clamp-2">
                                  {task.description}
                                </div>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <div className={`text-xs px-2 py-0.5 rounded-full ${
                                  task.priority === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {task.priority === 'high' ? 'Высокий' : 
                                   task.priority === 'medium' ? 'Средний' : 'Низкий'}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTaskEdit(task);
                                    }}
                                  >
                                    <Edit size={12} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTaskDelete(task.id);
                                    }}
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
