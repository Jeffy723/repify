import { Stack } from "expo-router";

export default function AssignmentsLayout() {
  return (
    <Stack>
      {/* This is the main list */}
      <Stack.Screen 
        name="index" 
        options={{ title: "Assignments", headerShown: false }} 
      />
      {/* This is the details page */}
      <Stack.Screen 
        name="assignment-details" 
        options={{ title: "Details", headerBackTitle: "Back" }} 
      />
      {/* This is the edit page */}
      <Stack.Screen 
        name="edit" 
        options={{ title: "Edit Assignment", presentation: 'modal' }} 
      />
    </Stack>
  );
}