import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import compose from '../../../libs/compose';
import CONST from '../../../CONST';
import Navigation from '../../../libs/Navigation/Navigation';
import ONYXKEYS from '../../../ONYXKEYS';
import * as ReportActionsUtils from '../../../libs/ReportActionsUtils';
import * as ReportUtils from '../../../libs/ReportUtils';
import * as TransactionUtils from '../../../libs/TransactionUtils';
import * as Policy from '../../../libs/actions/Policy';
import withCurrentUserPersonalDetails, {withCurrentUserPersonalDetailsPropTypes} from '../../../components/withCurrentUserPersonalDetails';
import EditRequestDescriptionPage from '../../EditRequestDescriptionPage';
import EditRequestMerchantPage from '../../EditRequestMerchantPage';
import EditRequestCreatedPage from '../../EditRequestCreatedPage';
import EditRequestAmountPage from '../../EditRequestAmountPage';
import EditRequestReceiptPage from '../../EditRequestReceiptPage';
import reportPropTypes from '../../reportPropTypes';
import * as IOU from '../../../libs/actions/IOU';
import * as CurrencyUtils from '../../../libs/CurrencyUtils';
import EditRequestDistancePage from '../../EditRequestDistancePage';
import FullPageNotFoundView from '../../../components/BlockingViews/FullPageNotFoundView';
import EditRequestCategoryPage from '../../EditRequestCategoryPage';
import ScreenWrapper from '../../../components/ScreenWrapper';
import useLocalize from '../../../hooks/useLocalize';
import styles from '../../../styles/styles';
import themeColors from '../../../styles/themes/default';
import DragAndDropProvider from '../../../components/DragAndDrop/Provider';
import * as IOUUtils from '../../../libs/IOUUtils';
import HeaderWithBackButton from '../../../components/HeaderWithBackButton';
import TabSelector from '../../../components/TabSelector/TabSelector';
import OnyxTabNavigator, {TopTab} from '../../../libs/Navigation/OnyxTabNavigator';
import NewRequestAmountPage from '../steps/NewRequestAmountPage';
import CreateIOUStartTabManual from './CreateIOUStartTabManual';

const propTypes = {
    /** Route from navigation */
    route: PropTypes.shape({
        /** Params from the route */
        params: PropTypes.shape({
            /** The type of IOU being created */
            iouType: PropTypes.oneOf(_.values(CONST.IOU.MONEY_REQUEST_TYPE)).isRequired,

            /** The optimistic ID of a new transaction that is being created */
            transactionID: PropTypes.string.isRequired,

            /** reportID if a transaction is attached to a specific report */
            reportID: PropTypes.string,
        }),
    }).isRequired,
};

const defaultProps = {};

function CreateIOUStartPage({
    route: {
        params: {iouType, reportID},
    },
}) {
    const {translate} = useLocalize();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const title = {
        [CONST.IOU.MONEY_REQUEST_TYPE.REQUEST]: translate('iou.requestMoney'),
        [CONST.IOU.MONEY_REQUEST_TYPE.SEND]: translate('iou.sendMoney'),
        [CONST.IOU.MONEY_REQUEST_TYPE.SPLIT]: translate('iou.splitBill'),
    };
    // @TODO const isFromGlobalCreate = !reportID;
    // @TODO const isExpenseRequest = ReportUtils.isPolicyExpenseChat(props.report);
    // @TODO const shouldDisplayDistanceRequest = isExpenseRequest || isFromGlobalCreate;
    const shouldDisplayDistanceRequest = true;

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableKeyboardAvoidingView={false}
            headerGapStyles={
                isDraggingOver
                    ? [
                          {
                              backgroundColor: themeColors.receiptDropUIBG,
                          },
                      ]
                    : []
            }
            testID={CreateIOUStartPage.displayName}
        >
            {({safeAreaPaddingBottomStyle}) => (
                <FullPageNotFoundView shouldShow={!IOUUtils.isValidMoneyRequestType(iouType)}>
                    <DragAndDropProvider
                        isDisabled={props.selectedTab !== CONST.TAB.SCAN}
                        setIsDraggingOver={setIsDraggingOver}
                    >
                        <View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                            <HeaderWithBackButton
                                title={title[iouType]}
                                onBackButtonPress={Navigation.dismissModal}
                            />
                            {iouType === CONST.IOU.MONEY_REQUEST_TYPE.REQUEST ? (
                                <OnyxTabNavigator
                                    id={CONST.TAB.RECEIPT_TAB_ID}
                                    selectedTab={props.selectedTab}
                                    tabBar={({state, navigation, position}) => (
                                        <TabSelector
                                            state={state}
                                            navigation={navigation}
                                            onTabPress={resetMoneyRequestInfo}
                                            position={position}
                                        />
                                    )}
                                >
                                    <TopTab.Screen
                                        name={CONST.TAB.MANUAL}
                                        component={CreateIOUStartTabManual}
                                        initialParams={{reportID, iouType}}
                                    />
                                    <TopTab.Screen
                                        name={CONST.TAB.SCAN}
                                        component={ReceiptSelector}
                                        initialParams={{reportID, iouType, pageIndex: 1}}
                                    />
                                    {shouldDisplayDistanceRequest && (
                                        <TopTab.Screen
                                            name={CONST.TAB.DISTANCE}
                                            component={NewDistanceRequestPage}
                                            initialParams={{reportID, iouType}}
                                        />
                                    )}
                                </OnyxTabNavigator>
                            ) : (
                                <CreateIOUStartTabManual route={props.route} />
                            )}
                        </View>
                    </DragAndDropProvider>
                </FullPageNotFoundView>
            )}
        </ScreenWrapper>
    );
}

CreateIOUStartPage.displayName = 'CreateIOUStartPage';
CreateIOUStartPage.propTypes = propTypes;
CreateIOUStartPage.defaultProps = defaultProps;
export default CreateIOUStartPage;
