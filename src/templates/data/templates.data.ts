export const templates = {
  "meeting-notes": {
    title: "Meeting Notes",
    blocks: [
      { type: "heading", content: "Meeting Notes" },
      { type: "text", content: "Date: " },
      { type: "text", content: "Attendees: " },
      { type: "divider", content: "" },
      { type: "heading", content: "Agenda" },
      { type: "bullet-list-item", content: "Topic 1" },
      { type: "bullet-list-item", content: "Topic 2" },
      { type: "heading", content: "Notes" },
      { type: "text", content: "Write meeting notes here..." },
      { type: "heading", content: "Action Items" },
      { type: "to-do", content: "Follow up on action 1" },
      { type: "to-do", content: "Send meeting summary" },
    ],
  },

  "kanban-board": {
    title: "Kanban Board",
    blocks: [
      { type: "heading", content: "Kanban Board" },
      { type: "board-column", content: "To Do" },
      { type: "to-do", content: "Task 1" },
      { type: "to-do", content: "Task 2" },
      { type: "board-column", content: "In Progress" },
      { type: "to-do", content: "Task 3" },
      { type: "board-column", content: "Done" },
      { type: "to-do", content: "Task 4" },
    ],
  },

  "project-plan": {
    title: "Project Plan",
    blocks: [
      { type: "heading", content: "Project Plan" },
      { type: "heading-2", content: "Goals" },
      { type: "bullet-list-item", content: "Goal 1" },
      { type: "bullet-list-item", content: "Goal 2" },
      { type: "heading-2", content: "Timeline" },
      { type: "text", content: "Start Date: " },
      { type: "text", content: "End Date: " },
      { type: "heading-2", content: "Milestones" },
      { type: "numbered-list-item", content: "Milestone 1" },
      { type: "numbered-list-item", content: "Milestone 2" },
    ],
  },

  "daily-journal": {
    title: "Daily Journal",
    blocks: [
      { type: "heading", content: "Daily Journal" },
      { type: "text", content: "Date: " },
      { type: "heading-2", content: "Mood" },
      { type: "text", content: "How do you feel today?" },
      { type: "heading-2", content: "What went well?" },
      { type: "text", content: "Write your successes" },
      { type: "heading-2", content: "What can be improved?" },
      { type: "text", content: "Write your reflections" },
    ],
  },
};