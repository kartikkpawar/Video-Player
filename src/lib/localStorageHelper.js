export const saveVideoStatus = (completedDuration, activeVideo) => {
  const data = { ...activeVideo, completedDuration };

  let localVideos = localStorage.getItem("vp-videos-data");

  if (!localVideos) {
    localStorage.setItem("vp-videos-data", JSON.stringify([data]));
    return;
  }
  localVideos = JSON.parse(localVideos);
  const videoIndex = localVideos.findIndex(
    (video) => video.id === activeVideo.id
  );

  if (videoIndex === -1) {
    localVideos.push(data);
    localStorage.setItem("vp-videos-data", JSON.stringify(localVideos));
    return;
  }

  localVideos[videoIndex].completedDuration = completedDuration;
  localStorage.setItem("vp-videos-data", JSON.stringify(localVideos));
};

export const getCurrentVideoStatus = (videoId) => {
  let localVideos = localStorage.getItem("vp-videos-data");

  if (!localVideos) return false;
  localVideos = JSON.parse(localVideos);
  const isPresent = localVideos.filter((video) => video.id === videoId);
  if (isPresent.length === 0) return false;
  return isPresent[0];
};

export const setAutoPlayStatus = (autoplay) => {
  localStorage.setItem("vp-videos-autoplay", JSON.stringify(autoplay));
};
export const getAutoPlayStatus = (autoplay) => {
  let autoplayValue = localStorage.getItem("vp-videos-autoplay");
  if (!autoplayValue) return false;

  autoplayValue = JSON.parse(autoplayValue);
  return autoplayValue;
};
