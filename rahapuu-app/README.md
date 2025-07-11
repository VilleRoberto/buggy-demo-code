# 🌳 Rahapuu - Children's Savings Game

A delightful and interactive savings app designed to teach children about money management through a beautiful visual tree that grows as they save. Perfect for ages 4-12!

## ✨ Features

### 🌱 Interactive Money Tree
- Visual tree that grows with each savings contribution
- Different elements appear based on saving amounts:
  - 🍃 Leaves for small savings (< €2)
  - 🌸 Flowers for medium savings (€2-5)
  - 🍎 Fruits for larger savings (€5+)
- Beautiful animations when new elements are added
- Tree grows bigger as more savings are added

### 🎯 Savings Goals
- Create personalized savings goals with custom icons and colors
- Visual progress bars show progress toward each goal
- Celebrations when goals are achieved
- Link savings directly to specific goals

### 💰 Savings Tracking
- Easy-to-use interface for adding savings
- Transaction history with dates and descriptions
- Quick amount buttons for common values
- Optional linking to specific goals

### 🎨 Child-Friendly Design
- Colorful, engaging interface designed for children
- Large buttons and clear visual feedback
- Smooth animations and friendly emojis
- Bilingual support (Finnish and English)

### 📱 Mobile-First Design
- Optimized for tablets and phones
- Touch-friendly interface
- Works great on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd rahapuu-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎮 How to Use

### For Children

1. **Start with the Tree View**: This is your magical money tree! It starts small but will grow as you save.

2. **Add Your First Savings**: 
   - Tap the "Savings" tab
   - Tap the "+" button
   - Enter how much you saved
   - Watch your tree grow!

3. **Set Savings Goals**:
   - Tap the "Goals" tab
   - Tap "+" to add a new goal
   - Choose a name, amount, icon, and color
   - Save money toward your goal!

4. **Watch Your Progress**:
   - See your tree get bigger and more beautiful
   - Watch your progress bars fill up
   - Celebrate when you reach your goals!

### For Parents

This app is designed to be used together with your child. Here's how to make the most of it:

1. **Set Up Together**: Help your child create their first savings goal - something small and achievable.

2. **Regular Updates**: Make it a routine to update the app when your child saves money (allowance, gifts, chore rewards).

3. **Celebrate Achievements**: When goals are reached, celebrate together and set new ones.

4. **Use as Teaching Tool**: Discuss concepts like saving, goals, and patience as you use the app.

## 🔧 Technical Details

### Built With
- **React 18** - Modern React with TypeScript
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icons
- **Local Storage** - Data persistence without requiring a backend

### Key Components
- **Tree Component**: Renders the interactive money tree with dynamic elements
- **Goals Component**: Manages savings goals with progress tracking
- **Savings Component**: Handles adding and viewing savings transactions
- **Navigation**: Mobile-friendly bottom navigation
- **Context API**: Global state management for the app

### Data Storage
- All data is stored locally in the browser's localStorage
- No personal information is sent to external servers
- Data persists between sessions

## 🌍 Language Support

The app currently supports:
- 🇫🇮 **Finnish (Suomi)** - Default language
- 🇬🇧 **English** - Available through settings

## 🎨 Customization

The app is designed to be easily customizable:

### Colors
Modify the tree and UI colors in `tailwind.config.js`:
```javascript
colors: {
  'tree-green': '#22c55e',
  'tree-brown': '#92400e',
  'sky-blue': '#3b82f6',
  // ... more colors
}
```

### Icons and Emojis
Goal icons and tree elements can be customized in the respective components.

## 🤝 Contributing

This is a demo application, but contributions are welcome! Here are some ideas for improvements:

- **Chores System**: Add ability to earn money through completing chores
- **Parent Dashboard**: Advanced settings and oversight features
- **Sound Effects**: Audio feedback for achievements
- **Themes**: Different tree types and backgrounds
- **Export/Import**: Share progress between devices
- **Achievements**: Badges and rewards for milestones

## 📱 Mobile Installation

While this is a web app, it can be installed as a PWA (Progressive Web App) on mobile devices:

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Install it like a native app

## 🐛 Troubleshooting

### App Won't Load
- Make sure you have a modern browser (Chrome, Firefox, Safari, Edge)
- Clear browser cache and reload
- Check browser console for errors

### Data Lost
- Data is stored in browser localStorage
- If you clear browser data, savings will be lost
- Consider regular screenshots of progress

### Performance Issues
- The app is optimized for modern devices
- Older devices may experience slower animations
- Disable animations in settings if needed

## 📄 License

This project is open source and available under the MIT License.

## 🎉 About

Rahapuu was created to make learning about money fun and engaging for children. The idea comes from the concept that savings should grow like a tree - slowly, steadily, and beautifully over time.

The app encourages positive saving habits through:
- **Visual Feedback**: Immediate visual reward for saving
- **Goal Setting**: Learning to work toward objectives
- **Progress Tracking**: Understanding accumulation over time
- **Celebration**: Positive reinforcement for achievements

Perfect for families who want to introduce financial literacy in a fun, stress-free way!

---

**Happy Saving! 🌳💰**
