class NavigationService {
  static navigate(path: string) {
    window.location.href = path;
  }

  static getCurrentPath() {
    return window.location.pathname;
  }
}

export default NavigationService;
