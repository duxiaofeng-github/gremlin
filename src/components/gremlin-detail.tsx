import { css, cx } from "@linaria/core";
import React, { useMemo, useState } from "react";
import {
  cancelOfferById,
  fillOfferById,
  getAvailableMarketOfferById,
  getGremlinById,
  makeOfferById,
  parseId,
} from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import {
  colorTextLightGray,
  fontSizeSmall,
  fontSizeXlarge,
  styleBackgroundWhite,
  styleFlex,
  styleFlexDirectionColumn,
  styleFullWidthAndHeight,
} from "../utils/styles";
import { FullScreenTips } from "./common/full-screen-tips";
import { Loading } from "./common/loading";
import { Button, Dialog, ProgressBar, Toast } from "antd-mobile";
import { useRexContext } from "../utils/store/store";
import { IStore, updateOffers } from "../utils/store";
import { OfferModal } from "./common/offer-modal";
import { useSubmission } from "../utils/hooks/use-submission";
import Eth from "../../public/eth.svg";
import { formatPrice } from "../utils/common";

interface IProps {
  id?: string;
}

export const GremlinDetail: React.SFC<IProps> = (props) => {
  const { id } = props;
  const parsedId = parseId(id);
  const { walletAddress, offers } = useRexContext((store: IStore) => store);
  const offer = useMemo(() => (offers ? getAvailableMarketOfferById(offers, parsedId) : undefined), [offers, parsedId]);
  const options = useData(async () => {
    if (parsedId) {
      const gremlin = await getGremlinById(parsedId);

      return { gremlin };
    }
  }, [id]);
  const [modalVisible, setModalVisible] = useState(false);
  const { triggerer: makeOffer } = useSubmission(async (data?: { price: number }) => {
    const { price } = data!;

    await makeOfferById(parsedId, price, walletAddress!);
    await updateOffers();

    Toast.show("Make offer successful!");
  });

  const { triggerer: cancelOffer } = useSubmission(async (data?: { offerId: number }) => {
    const { offerId } = data!;

    await cancelOfferById(offerId, walletAddress!);
    await updateOffers();

    Toast.show("Cancel offer successful!");
  });

  const { triggerer: fillOffer } = useSubmission(async (data?: { offerId: number; price: number }) => {
    const { offerId, price } = data!;
    await fillOfferById(offerId, walletAddress!, price);
    await updateOffers();
    await options.retry();

    Toast.show("Fill offer successful!");
  });

  return (
    <Loading
      skipDataChecking
      options={options}
      render={(data) => {
        if (!data || !data.gremlin) {
          return <FullScreenTips type="warning" mainTips="Something went wrong" />;
        }

        const { gremlin } = data;
        const { owner, metaData, id } = gremlin;
        const ownerUser = offer ? offer.user : owner;
        const isMyGremlin = walletAddress === ownerUser;

        return (
          <div className={cx(styleFullWidthAndHeight, styleBackgroundWhite, styleFlex, styleFlexDirectionColumn)}>
            {gremlin.metaData ? (
              <div className={styleContainer}>
                <img className={styleCover} src={gremlin.metaData.image} />
                <div className={styleName}>Name: {gremlin.metaData.name}</div>
                {offer && (
                  <div className={stylePriceContainer}>
                    <Eth className={styleIcon} width={20} height={20} fill="var(--adm-color-text)" />
                    Sale for<div className={stylePrice}>{formatPrice(offer.price)} ETH</div>
                  </div>
                )}
                <div className={styleAttributes}>
                  {gremlin.metaData.attributes &&
                    gremlin.metaData.attributes.map((item, index) => {
                      return (
                        <>
                          <div className={styleAttributeName}>{formatAttributeName(item.trait_type)}</div>
                          <ProgressBar
                            percent={parseInt(`${item.value}`)}
                            style={{
                              "--track-width": "8px",
                              "--fill-color":
                                index % 4 === 1
                                  ? "var(--adm-color-success)"
                                  : index % 4 === 2
                                  ? "var(--adm-color-danger)"
                                  : index % 4 === 3
                                  ? "var(--adm-color-warning)"
                                  : "var(--adm-color-primary)",
                            }}
                          />
                        </>
                      );
                    })}
                </div>
                {isMyGremlin ? (
                  offer ? (
                    <Button
                      block
                      color="danger"
                      onClick={() => {
                        Dialog.confirm({
                          content: "Are you sure to cancel the order?",
                          onConfirm: () => {
                            cancelOffer({ offerId: offer.offerId });
                          },
                        });
                      }}>
                      Cancel Order
                    </Button>
                  ) : (
                    <Button
                      block
                      color="primary"
                      onClick={() => {
                        setModalVisible(true);
                      }}>
                      Make Offer
                    </Button>
                  )
                ) : offer ? (
                  <Button
                    block
                    color="primary"
                    onClick={() => {
                      Dialog.confirm({
                        content: "Are you sure to buy this gremlin?",
                        onConfirm: () => {
                          fillOffer({ offerId: offer.offerId, price: offer.price });
                        },
                      });
                    }}>
                    Buy
                  </Button>
                ) : null}
              </div>
            ) : null}

            <OfferModal
              visible={modalVisible}
              onOk={(price: number) => {
                makeOffer({ price });

                setModalVisible(false);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
            />
          </div>
        );
      }}
    />
  );
};

function formatAttributeName(name: string) {
  switch (name) {
    case "hp":
      return "HP";
    case "mp":
      return "MP";
    case "intelligence":
      return "Intelligence";
    case "dexterity":
      return "Dexterity";
    case "strength":
      return "Strength";
  }

  return name;
}

const styleContainer = css`
  margin: 20px;
`;

const styleCover = css`
  display: block;
  margin: 0 auto;
  height: 50vw;
  width: 50vw;
  max-height: 500px;
  max-width: 500px;
`;

const styleName = css`
  margin-top: 20px;
  font-size: ${fontSizeXlarge};
  font-weight: bold;
  text-align: center;
`;

const styleAttributeName = css`
  margin-top: 15px;
  margin-bottom: 7px;
  font-size: ${fontSizeSmall};
  color: ${colorTextLightGray};
  font-weight: bold;
`;

const styleAttributes = css`
  margin-bottom: 40px;
`;

const styleIcon = css`
  margin-left: -3px;
  margin-right: 5px;
`;

const stylePriceContainer = css`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const stylePrice = css`
  color: var(--adm-color-danger);
  padding-left: 5px;
`;
