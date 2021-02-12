// Security

// 로그인하지 않은 사용자
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인한 사용자만 접근 가능합니다.");
  }
};

// 로그인 완료한 사용자
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
