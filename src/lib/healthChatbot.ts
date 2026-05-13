type Response = { keywords: string[]; answer: string };

const responses: Response[] = [
  {
    keywords: ["sleep", "insomnia", "rest", "bedtime", "nap"],
    answer:
      "Here are some tips to improve your sleep:\n\n• Stick to a consistent sleep schedule — even on weekends.\n• Avoid screens at least 30 minutes before bed.\n• Keep your bedroom cool, dark, and quiet.\n• Limit caffeine after 2 PM.\n• Try relaxation techniques like deep breathing or meditation before bed.\n• Aim for 7–9 hours of sleep each night.",
  },
  {
    keywords: ["step", "walk", "walking", "steps"],
    answer:
      "A common goal is 10,000 steps per day, but even 7,000–8,000 steps provides significant health benefits.\n\n• Start with short walks after meals.\n• Take the stairs instead of the elevator.\n• Walk during phone calls.\n• Set hourly reminders to move.\n• Gradually increase your daily count by 500 steps each week.",
  },
  {
    keywords: ["calorie", "calories", "diet", "eat", "food", "intake", "meal"],
    answer:
      "Healthy calorie intake varies by person, but general guidelines:\n\n• Women: ~1,800–2,200 cal/day\n• Men: ~2,200–2,800 cal/day\n• Focus on nutrient-dense foods: fruits, vegetables, lean proteins, whole grains.\n• Track your meals to stay aware of your intake.\n• Avoid empty calories from sugary drinks and processed snacks.\n• Eating balanced meals helps maintain energy throughout the day.",
  },
  {
    keywords: ["water", "hydration", "hydrate", "drink", "thirst", "dehydrated"],
    answer:
      "Staying hydrated is essential for overall health:\n\n• Aim for 2–3 liters (8–12 cups) of water daily.\n• Drink a glass of water first thing in the morning.\n• Carry a reusable water bottle with you.\n• Eat water-rich foods like cucumbers, watermelon, and oranges.\n• If your urine is pale yellow, you're likely well-hydrated.\n• Increase intake during exercise or hot weather.",
  },
  {
    keywords: ["exercise", "workout", "fitness", "gym", "run", "running", "active", "activity"],
    answer:
      "Regular exercise is key to a healthy lifestyle:\n\n• Aim for at least 150 minutes of moderate activity per week.\n• Include a mix of cardio (walking, cycling) and strength training.\n• Start small and gradually increase intensity.\n• Even 10-minute sessions count — consistency matters most.\n• Stretch before and after workouts to prevent injury.\n• Find activities you enjoy to stay motivated.",
  },
  {
    keywords: ["stress", "anxiety", "mental", "relax", "calm", "meditation", "mindful"],
    answer:
      "Managing stress is important for both mental and physical health:\n\n• Practice deep breathing exercises (4-7-8 technique).\n• Try mindfulness meditation for 5–10 minutes daily.\n• Get regular physical activity — it's a natural stress reliever.\n• Maintain social connections and talk to someone you trust.\n• Limit news and social media consumption.\n• Prioritize sleep and relaxation time.",
  },
  {
    keywords: ["heart", "heart rate", "cardio", "blood pressure", "bp"],
    answer:
      "Heart health is fundamental to overall wellbeing:\n\n• A normal resting heart rate is 60–100 bpm.\n• Regular cardio exercise strengthens your heart.\n• Reduce sodium intake to help manage blood pressure.\n• Eat heart-healthy foods: fish, nuts, berries, leafy greens.\n• Avoid smoking and limit alcohol.\n• Monitor your heart rate during exercise to stay in safe zones.",
  },
  {
    keywords: ["weight", "lose", "gain", "bmi", "fat", "slim", "obesity"],
    answer:
      "Weight management is about balance and sustainability:\n\n• Focus on gradual changes rather than crash diets.\n• A safe rate of weight loss is 0.5–1 kg per week.\n• Combine balanced nutrition with regular exercise.\n• Track your progress but don't obsess over daily numbers.\n• Get enough sleep — poor sleep affects metabolism.\n• Consult a healthcare professional for personalized advice.",
  },
  {
    keywords: ["habit", "lifestyle", "healthy", "routine", "tip", "tips", "advice", "suggestion"],
    answer:
      "Here are some general healthy lifestyle tips:\n\n• Eat a balanced diet with plenty of fruits and vegetables.\n• Stay physically active — move your body every day.\n• Get 7–9 hours of quality sleep.\n• Stay hydrated throughout the day.\n• Manage stress with relaxation techniques.\n• Limit processed foods, sugar, and excessive caffeine.\n• Schedule regular health check-ups.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    answer:
      "Hello! 👋 I'm your Health Assistant. I can help you with questions about:\n\n• Sleep improvement\n• Exercise suggestions\n• Calorie balance\n• Hydration tips\n• Stress management\n• Heart health\n• Weight management\n• Healthy lifestyle habits\n\nFeel free to ask me anything!",
  },
];

const fallback =
  "I'm not sure about that, but here are some general health tips:\n\n• Stay active with at least 30 minutes of movement daily.\n• Eat a balanced diet rich in whole foods.\n• Drink plenty of water.\n• Get 7–9 hours of sleep.\n• Take breaks and manage stress.\n\nTry asking me about sleep, exercise, calories, hydration, or stress!";

export function getHealthChatResponse(message: string): string {
  const lower = message.toLowerCase();
  let bestMatch: Response | null = null;
  let bestCount = 0;

  for (const r of responses) {
    const count = r.keywords.filter((k) => lower.includes(k)).length;
    if (count > bestCount) {
      bestCount = count;
      bestMatch = r;
    }
  }

  return bestMatch ? bestMatch.answer : fallback;
}
