<?php
/**
 * Class Google\Site_Kit\Modules\Idea_Hub\Post_Idea_Text
 *
 * @package   Google\Site_Kit\Modules\Idea_Hub
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Idea_Hub;

use Google\Site_Kit\Core\Storage\Post_Meta_Setting;

/**
 * Class for Idea Hub text setting.
 *
 * @since 1.33.0
 * @access private
 * @ignore
 */
class Post_Idea_Text extends Post_Meta_Setting {

	const META_KEY = 'googlesitekitpersistent_idea_text';

	/**
	 * Gets the `show_in_rest` value for this setting, which should be true.
	 *
	 * @since n.e.x.t
	 *
	 * @return bool Always returns true for this postmeta setting.
	 */
	protected function get_show_in_rest() {
		return true;
	}

}
