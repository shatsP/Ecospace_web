import { useAppStore } from "../core/StateStore";
import { parseInput } from "./NLP";

type AppType = "notes" | "timer" | "planner";

const routeIntentToApp = (intent: string): AppType | null => {
  switch (intent) {
    case "open_notes":
      return "notes";
    case "open_timer":
      return "timer";
    case "open_planner":
    case "generate_week_plan":
      return "planner";
    default:
      return null;
  }
};

export const handleItiInput = (input: string) => {
  console.log("🧑 You:", input);
  console.log("handleItiInput called with:", input);

  const parsed = parseInput(input);
  const appType = routeIntentToApp(parsed.intent);

  const { openApp, setPlannerRawTasks } = useAppStore.getState();

  // 🌟 Handle smart launcher intent (e.g., launch_order_food)
  if (parsed.intent.startsWith("launch_")) {
    const bareIntent = parsed.intent.replace("launch_", "");

    console.log("🍽 Entities passed:", parsed.entities); // ✅ Add this line

    if (window?.ecospace?.launchByIntent) {
      window.ecospace.launchByIntent(bareIntent, input, parsed.entities); // ✅ Pass entities here
      console.log(`🚀 Iti: Launching external intent: ${bareIntent}`);
    } else {
      console.warn("❌ Ecospace launcher not available in this context.");
    }

    return { intent: parsed.intent };
  }

  // 📅 Handle planning tasks
  if (parsed.intent === "generate_week_plan" || parsed.intent === "open_planner") {
    const match = input.match(/(?:plan|schedule|start).*week[:\s]*(.*)/i);
    const taskSegment = match?.[1] ?? "";
    console.log("🔍 Task segment:", taskSegment);

    const extractedTasks = taskSegment
      .split(/,|and/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    console.log("🔍 Extracted tasks:", extractedTasks);

    if (extractedTasks.length > 0) {
      setPlannerRawTasks(extractedTasks);
      console.log("📋 Updated planner tasks:", useAppStore.getState().plannerRawTasks);
    }
  }

  if (appType) {
    openApp(appType);
    console.log(`🤖 Iti: Opening ${appType} for you ✨`);
  } else {
    console.log("🤖 Iti: I'm not sure what you meant 😕");
    console.log("🔍 Unclear intent:", parsed);
  }

  return { intent: parsed.intent }; // used for toggle logic
};
