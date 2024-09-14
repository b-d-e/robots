const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeSound = document.getElementById('theme-sound');

// Function to update the theme icon based on the current theme
const updateThemeIcon = (isDarkMode) => {
    const themeMode = isDarkMode ? 'darkMode' : 'lightMode';
    const iconPath = themeIcon.querySelector('use').getAttribute('href').replace(/#.*$/, `#${themeMode}`);
    themeIcon.querySelector('use').setAttribute('href', iconPath);
};


updateGitGraph = (isDarkMode, fade=true) => {
    const gitGraph = document.getElementById('gitgraph');
    // dark url - https://benjaminetheridge.com/gitgraph/dark.html?nocache=1
    // light url - https://benjaminetheridge.com/gitgraph/light.html?nocache=1
    const gitGraphUrl = isDarkMode ?
        'https://benjaminetheridge.com/gitgraph/dark.html?nocache=1' :
        'https://benjaminetheridge.com/gitgraph/light.html?nocache=1';

    // fade between
    if (!fade) {
        gitGraph.setAttribute('src', gitGraphUrl);
        return;
    }
    gitGraph.style.opacity = 0;
    setTimeout(() => {
        gitGraph.setAttribute('src', gitGraphUrl);
        gitGraph.style.opacity = 1;
    }, 500);
    gitGraph.setAttribute('src', gitGraphUrl);
}

// Function to update the theme based on the current mode
const updateTheme = (isDarkMode) => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateGitGraph(isDarkMode, false);
    updateThemeIcon(isDarkMode);
};

// Function to toggle the theme
const toggleTheme = () => {
    const isDarkMode = toggleButton.checked;
    updateTheme(isDarkMode);
    themeSound.play();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Add transition class to body for smooth transition
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
};

// Event listener for theme toggle
toggleButton.addEventListener('change', toggleTheme);

// Function to initialize the theme based on the stored preference
const initializeTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
    toggleButton.checked = isDarkMode;
    updateTheme(isDarkMode);
};

// Initialize the theme
initializeTheme();

// Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initializeTheme);

