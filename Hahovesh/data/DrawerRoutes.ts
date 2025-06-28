/**
 * @file AppDrawer.tsx
 * @description This file defines the items for the side drawer navigation in the app.
 * It includes the labels, icons, routes, minimum roles required to access each item, and the section they belong to.
 */

export type DrawerItem = {
  label: string;
  icon: string;
  route: string;
  minRole: number;
  section: "account" | "menu";
};

export const drawerItems: DrawerItem[] = [
  {
    label: "דף הבית",
    icon: "home",
    route: "home",
    minRole: 0,
    section: "account",
  },
  {
    label: "שליחת הודעה",
    icon: "chatbubbles",
    route: "messages/MessagesForm",
    minRole: 2,
    section: "menu",
  },
  {
    label: "צפייה בסטטיסטיקות",
    icon: "analytics",
    route: "statistics",
    minRole: 2,
    section: "menu",
  },
  {
    label: "צפייה בדוחות סיכום",
    icon: "document-text",
    route: "summaryReports",
    minRole: 2,
    section: "menu",
  },
  {
    label: "ניהול משתמשים",
    icon: "people",
    route: "UserManagement",
    minRole: 2,
    section: "menu",
  },
];
