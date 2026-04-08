// Callback
scroll((progress) => {
  console.log(progress); // 0-1
});

// Link animation to scroll
scroll(animate("#progress", { scaleX: [0, 1] }));