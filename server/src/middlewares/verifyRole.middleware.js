const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Chưa xác thực token",
          success: false,
        });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Không có quyền truy cập",
          success: false,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi xác thực quyền",
        success: false,
      });
    }
  };
};

const verifyAdmin = verifyRole(['admin']);


const verifyUser = verifyRole(['user']);


const verifyUserOrAdmin = verifyRole(['user', 'admin']);

export { verifyRole, verifyAdmin, verifyUser, verifyUserOrAdmin };
