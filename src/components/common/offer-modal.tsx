import React from "react";
import { Dialog, Form, Input } from "antd-mobile";
import { css, cx } from "@linaria/core";
import {
  colorBorder,
  colorTextLightGray,
  fontSizeLarge,
  styleFlex,
  styleFlexAlignItemStart,
  stylePaddingLeft10,
  stylePaddingRight10,
} from "../../utils/styles";

interface IProps {
  visible: boolean;
  onOk: (price: number) => void;
  onCancel: () => void;
}

export const OfferModal: React.SFC<IProps> = (props) => {
  const { visible, onOk, onCancel } = props;
  const [form] = Form.useForm<{ price: string }>();

  async function submit() {
    const { price } = await form.validateFields();

    onOk(parseFloat(price));
  }

  return (
    <Dialog
      visible={visible}
      actions={[
        {
          key: "submit",
          text: "Submit",
          onClick: () => {
            submit();
          },
        },
        {
          key: "cancel",
          text: "Cancel",
          onClick: () => {
            onCancel();
          },
        },
      ]}
      content={
        <>
          <div className={styleTips}>Please input your price</div>
          <div className={cx(styleFlex, styleFlexAlignItemStart, stylePaddingLeft10, stylePaddingRight10)}>
            <Form
              className={styleForm}
              form={form}
              layout="horizontal"
              onFinish={() => {
                submit();
              }}>
              <Form.Item name="price" rules={[{ required: true, message: "Please input price" }]}>
                <Input />
              </Form.Item>
            </Form>
            <div className={styleUnit}>ETH</div>
          </div>
        </>
      }
    />
  );
};

const styleTips = css`
  text-align: center;
  font-size: ${fontSizeLarge};
  color: ${colorTextLightGray};
  margin-bottom: 20px;
`;

const styleUnit = css`
  font-size: ${fontSizeLarge};
  color: ${colorTextLightGray};
  margin-left: 10px;
  margin-top: 16px;
`;

const styleForm = css`
  .adm-list-default {
    border: none;

    .adm-input {
      border: solid 1px ${colorBorder};
      border-radius: 5px;
      padding: 3px;
    }
  }
`;
