// Runs in <head> before paint: the saved choice, else the system setting.
// ThemeToggle writes the same "theme" key, and AnimationToggle the "bg" key.
export const themeScript = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;if(localStorage.getItem('bg')==='off')document.documentElement.dataset.bg='off'}catch(e){}`;
