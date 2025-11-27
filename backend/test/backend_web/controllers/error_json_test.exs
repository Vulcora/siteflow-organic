defmodule BackendWeb.ErrorJSONTest do
  use BackendWeb.ConnCase, async: true

  test "renders 404" do
    assert BackendWeb.ErrorJSON.render("404.json", %{}) == %{error: "Not Found", message: "Resource not found"}
  end

  test "renders 500" do
    assert BackendWeb.ErrorJSON.render("500.json", %{}) ==
             %{error: "Internal Server Error", message: "Something went wrong"}
  end
end
