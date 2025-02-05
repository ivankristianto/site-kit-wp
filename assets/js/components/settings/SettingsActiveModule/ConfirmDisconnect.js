/**
 * ConfirmDisconnect component for SettingsActiveModule.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { ESCAPE } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_LOCATION } from '../../../googlesitekit/datastore/location/constants';
import { CORE_MODULES } from '../../../googlesitekit/modules/datastore/constants';
import { CORE_SITE } from '../../../googlesitekit/datastore/site/constants';
import { CORE_UI } from '../../../googlesitekit/datastore/ui/constants';
import { clearWebStorage } from '../../../util';
import Dialog from '../../Dialog';
const { useSelect, useDispatch } = Data;

export default function ConfirmDisconnect( { slug } ) {
	const [ isDeactivating, setIsDeactivating ] = useState( false );
	const { setValue } = useDispatch( CORE_UI );

	const dialogActiveKey = `module-${ slug }-dialogActive`;

	const dependentModules = useSelect( ( select ) => select( CORE_MODULES ).getModuleDependantNames( slug ) );
	const provides = useSelect( ( select ) => select( CORE_MODULES ).getModuleFeatures( slug ) );
	const module = useSelect( ( select ) => select( CORE_MODULES ).getModule( slug ) );
	const dashboardURL = useSelect( ( select ) => select( CORE_SITE ).getAdminURL( 'googlesitekit-dashboard' ) );
	const dialogActive = useSelect( ( select ) => select( CORE_UI ).getValue( dialogActiveKey ) );

	const handleDialog = useCallback( () => {
		setValue( dialogActiveKey, ! dialogActive );
	}, [ dialogActive, dialogActiveKey, setValue ] );

	useEffect( () => {
		const onKeyPress = ( event ) => {
			if ( ESCAPE === event.keyCode ) {
				handleDialog();
			}
		};

		global.addEventListener( 'keydown', onKeyPress );
		return () => {
			global.removeEventListener( 'keydown', onKeyPress );
		};
	}, [ handleDialog ] );

	const { deactivateModule } = useDispatch( CORE_MODULES );
	const { navigateTo } = useDispatch( CORE_LOCATION );
	const handleDisconnect = useCallback( async () => {
		if ( module.forceActive ) {
			return;
		}

		setIsDeactivating( true );
		const { error } = await deactivateModule( slug );

		if ( ! error ) {
			clearWebStorage();
			navigateTo( dashboardURL );
		} else {
			// Only set deactivating to false if there is an error.
			setIsDeactivating( false );
		}
	}, [ slug, module?.forceActive, dashboardURL, deactivateModule, navigateTo ] );

	if ( ! module || ! dialogActive ) {
		return null;
	}

	const { name } = module;

	const title = sprintf(
		/* translators: %s: module name */
		__( 'Disconnect %s from Site Kit?', 'google-site-kit' ),
		name,
	);

	const subtitle = sprintf(
		/* translators: %s: module name */
		__( 'By disconnecting the %s module from Site Kit, you will no longer have access to:', 'google-site-kit' ),
		name,
	);

	let dependentModulesText = null;
	if ( dependentModules.length > 0 ) {
		dependentModulesText = sprintf(
			/* translators: %1$s: module name, %2$s: list of dependent modules */
			__( 'these active modules depend on %1$s and will also be disconnected: %2$s', 'google-site-kit' ),
			name,
			dependentModules,
		);
	}

	return (
		<Dialog
			dialogActive
			handleDialog={ handleDialog }
			title={ title }
			subtitle={ subtitle }
			provides={ provides }
			handleConfirm={ handleDisconnect }
			dependentModules={ dependentModulesText }
			inProgress={ isDeactivating }
			danger
		/>
	);
}

ConfirmDisconnect.propTypes = {
	slug: PropTypes.string.isRequired,
};
