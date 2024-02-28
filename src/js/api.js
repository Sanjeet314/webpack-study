export function getMotivationalPictures() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockedResponse = [
        "images/motivational-pictures/mountain.jpg",
        "images/motivational-pictures/darts.jpg",
        "images/motivational-pictures/passion.jpg",
      ];
      resolve(mockedResponse);
    }, 7000);
  });
}
