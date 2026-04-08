func (h *Handler) CreateUser(c echo.Context) error {
  var req CreateUserRequest
  if err := c.Bind(&req); err != nil { return echo.ErrBadRequest }
  user, err := h.svc.CreateUser(c.Request().Context(), req)
  if err != nil { return err }
  return c.JSON(http.StatusCreated, user)
}