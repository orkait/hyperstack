function VideoPlayer() {
  const videoRef = useRef(null);
  const isPageVisible = usePageInView();

  useEffect(() => {
    if (!videoRef.current) return;
    isPageVisible ? videoRef.current.play() : videoRef.current.pause();
  }, [isPageVisible]);

  return <video ref={videoRef} src="/video.mp4" />;
}