import { notification } from "antd";

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (title: string, content: string) => {
    api.success({
      message: title,
      description: content,
      placement: "topRight",
    });
  };

  return {
    contextHolder,
    openNotification,
  };
};
