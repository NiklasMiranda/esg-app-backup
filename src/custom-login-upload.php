<?php
/*
Plugin Name: Company Login & Upload MU
Description: Frontend login + upload system for virksomheder med abonnementer.
Version: 1.1
Author: Dit Navn1
*/

if (!defined('ABSPATH')) exit;

// ============================================================================
// CUSTOM POST TYPE
// ============================================================================

add_action('init', function() {
    register_post_type('company', [
        'label' => 'Virksomheder',
        'public' => false,
        'show_ui' => true,
        'supports' => ['title'],
    ]);
});

// ============================================================================
// AUTHENTICATION - LOGIN & LOGOUT
// ============================================================================



// Handle login submission uden redirect til ?esg=1
add_action('init', function() {
    if (!isset($_POST['company_login'])) return;

    $creds = [
        'user_login'    => sanitize_user($_POST['log']),
        'user_password' => $_POST['pwd'],
        'remember'      => true,
    ];

    $user = wp_signon($creds, false);

    if (is_wp_error($user)) {
        // Gem fejl i transient for at vise på siden
        set_transient('company_login_error', 'Forkert brugernavn eller adgangskode', 60);
        wp_safe_redirect(site_url('/profil')); // redirect tilbage til profil
        exit;
    } else {
        // Log ind succes
        wp_set_current_user($user->ID);
        wp_set_auth_cookie($user->ID);
        wp_safe_redirect(site_url('/profil')); // redirect tilbage til profil
        exit;
    }
});



// Logout button shortcode
add_shortcode('company_logout', function() {
    if (!is_user_logged_in()) return '';

    $logout_url = wp_logout_url(site_url('/profil'));

    return '<div class="profile-actions">
                <a href="' . esc_url($logout_url) . '" class="logout-button">Log ud</a>
            </div>';
});


// ============================================================================
// REGISTRATION
// ============================================================================

// Handle registration submission
add_action('init', function() {
    if (!isset($_POST['company_register'])) return;

    if ($_POST['password'] !== $_POST['password_repeat']) {
        wp_die('Kodeordene matcher ikke.');
    }

    $company_name   = sanitize_text_field($_POST['company_name']);
    $first_name     = sanitize_text_field($_POST['first_name']);
    $last_name      = sanitize_text_field($_POST['last_name']);
    $email          = sanitize_email($_POST['email']);
    $phone          = sanitize_text_field($_POST['phone']);
    $cvr            = sanitize_text_field($_POST['cvr']);
    $industry_code  = sanitize_text_field($_POST['industry_code']);
    $password       = $_POST['password'];
    $username       = $email;

    $company_id = wp_insert_post([
        'post_title' => $company_name,
        'post_type'  => 'company',
        'post_status'=> 'publish',
    ]);

    if (is_wp_error($company_id)) {
        wp_die('Kunne ikke oprette virksomheden.');
    }

    update_post_meta($company_id, 'company_cvr', $cvr);
    update_post_meta($company_id, 'industry_code', $industry_code);

    if (email_exists($email)) {
        wp_die('Der findes allerede en bruger med denne e-mail.');
    }

    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        wp_die('Kunne ikke oprette bruger: ' . $user_id->get_error_message());
    }

    wp_update_user([
        'ID'           => $user_id,
        'first_name'   => $first_name,
        'last_name'    => $last_name,
        'display_name' => $first_name . ' ' . $last_name,
    ]);

    update_user_meta($user_id, 'company_id', $company_id);
    update_user_meta($user_id, 'phone', $phone);

    wp_set_current_user($user_id);
    wp_set_auth_cookie($user_id);
    wp_redirect(site_url('/profil'));
    exit;
});

// ============================================================================
// USER PROFILE EDITOR
// ============================================================================

// Profile editor shortcode
add_shortcode('user_profile_editor', function() {
    if (!is_user_logged_in()) {
        return '<p>Du skal være logget ind.</p>';
    }

    $current_user = wp_get_current_user();
    $is_admin = user_can($current_user, 'manage_options');

    // Hvilken bruger vises?
    $view_user_id = $current_user->ID;
    if ($is_admin && isset($_GET['view_user'])) {
        $view_user_id = (int) $_GET['view_user'];
    }

    $user = get_user_by('id', $view_user_id);
    if (!$user) return '<p>Bruger ikke fundet.</p>';

    // Hent virksomhed
    $company_id = get_user_meta($user->ID, 'company_id', true);
    $company = $company_id ? get_post($company_id) : null;

    // Autoudfyld virksomhed metadata
    $company_name   = $company ? $company->post_title : '';
    $company_cvr    = $company ? get_post_meta($company_id, 'company_cvr', true) : '';
    $industry_code  = $company ? get_post_meta($company_id, 'industry_code', true) : '';

    ob_start();
    ?>

    <div class="esg-account user-profile-editor-wrapper">

        <?php if ($is_admin): ?>
            <!-- ADMIN: Vælg bruger ud af formularen -->
            <div class="form-group admin-user-select">
                <label>Vælg bruger</label>
                <form method="get">
                    <select name="view_user" onchange="this.form.submit()">
                        <?php foreach (get_users() as $u): ?>
                            <option value="<?= $u->ID ?>" <?= selected($u->ID, $user->ID, false) ?>>
                                <?= esc_html($u->display_name . ' (' . $u->user_email . ')') ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </form>
            </div>
        <?php endif; ?>

        <!-- PROFIL-FORMULAR -->
        <form method="post" class="user-profile-editor account-form">
            <?php wp_nonce_field('update_user_profile', 'user_profile_nonce'); ?>
            <input type="hidden" name="edit_user_id" value="<?= esc_attr($user->ID) ?>">

            <!-- Kontaktperson -->
            <h3>Kontaktperson</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Fornavn</label>
                    <input type="text" name="first_name" value="<?= esc_attr($user->first_name) ?>">
                </div>
                <div class="form-group">
                    <label>Efternavn</label>
                    <input type="text" name="last_name" value="<?= esc_attr($user->last_name) ?>">
                </div>
            </div>

            <div class="form-group">
                <label>E-mail</label>
                <input type="email" name="email" value="<?= esc_attr($user->user_email) ?>">
            </div>

            <div class="form-group">
                <label>Telefon</label>
                <input type="text" name="phone" value="<?= esc_attr(get_user_meta($user->ID, 'phone', true)) ?>">
            </div>

            <!-- Virksomhed -->
            <h3>Virksomhed</h3>
            <div class="form-group">
                <label>Virksomhedsnavn</label>
                <input type="text" name="company_name" value="<?= esc_attr($company_name) ?>">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>CVR</label>
                    <input type="text" name="cvr" value="<?= esc_attr($company_cvr) ?>">
                </div>
                <div class="form-group">
                    <label>
                        Branchekode
                        <a href="https://erst.virk.dk/branchekode/kategori/indexKategori" target="_blank" rel="noopener noreferrer">
                            (find kode)
                        </a>
                    </label>
                    <input type="text" name="industry_code" value="<?= esc_attr($industry_code) ?>">
                </div>
            </div>

            <!-- Adgangskode -->
            <h3>Adgangskode</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Nyt kodeord</label>
                    <input type="password" name="password">
                </div>
                <div class="form-group">
                    <label>Gentag kodeord</label>
                    <input type="password" name="password_repeat">
                </div>
            </div>

            <button type="submit" name="save_user_profile">
                Gem ændringer
            </button>

            <?php echo do_shortcode('[company_logout class="logout-button"]'); ?>
        </form>
    </div>

    <?php
    return ob_get_clean();
});


// Handle profile editor submission
add_action('init', function() {
    if (!isset($_POST['save_user_profile'])) return;
    if (!isset($_POST['user_profile_nonce']) ||
        !wp_verify_nonce($_POST['user_profile_nonce'], 'update_user_profile')) {
        return;
    }

    if (!is_user_logged_in()) return;

    $editor = wp_get_current_user();
    $edit_user_id = (int) $_POST['edit_user_id'];

    // Rettighedstjek
    if ($editor->ID !== $edit_user_id && !user_can($editor, 'manage_options')) {
        wp_die('Ingen adgang');
    }

    // Opdater brugerdata
    wp_update_user([
        'ID'         => $edit_user_id,
        'first_name' => sanitize_text_field($_POST['first_name']),
        'last_name'  => sanitize_text_field($_POST['last_name']),
        'user_email' => sanitize_email($_POST['email']),
    ]);
    update_user_meta($edit_user_id, 'phone', sanitize_text_field($_POST['phone']));

    // Password (valgfrit)
    if (!empty($_POST['password'])) {
        if ($_POST['password'] !== $_POST['password_repeat']) {
            wp_die('Kodeord matcher ikke.');
        }
        wp_set_password($_POST['password'], $edit_user_id);
    }

    // Håndter virksomhed
    $company_id = get_user_meta($edit_user_id, 'company_id', true);

    // 1. Prøv at finde en eksisterende virksomhed af brugeren
    if (!$company_id) {
        $companies = get_posts([
            'post_type'   => 'company',
            'author'      => $edit_user_id,
            'numberposts' => 1,
        ]);
        if ($companies) {
            $company_id = $companies[0]->ID;
            update_user_meta($edit_user_id, 'company_id', $company_id);
        }
    }

    // 2. Hvis stadig ingen, opret ny virksomhed
    if (!$company_id) {
        $company_id = wp_insert_post([
            'post_title'  => sanitize_text_field($_POST['company_name']),
            'post_type'   => 'company',
            'post_status' => 'publish',
            'post_author' => $edit_user_id,
        ]);
        update_user_meta($edit_user_id, 'company_id', $company_id);
    }

    // 3. Opdater post_title og meta
    if ($company_id) {
        wp_update_post([
            'ID'         => $company_id,
            'post_title' => sanitize_text_field($_POST['company_name']),
        ]);
        update_post_meta($company_id, 'company_cvr', sanitize_text_field($_POST['cvr']));
        update_post_meta($company_id, 'industry_code', sanitize_text_field($_POST['industry_code']));
    }

    wp_redirect(site_url('/edit-profile?view=profile&updated=1'));
    exit;
});


// ============================================================================
// COMPANY FILE UPLOAD SYSTEM - SEPARATE FOLDERS + HIDE FROM MEDIA LIBRARY
// ============================================================================

// Skjul virksomheds-filer fra media library
add_action('pre_get_posts', 'company_files_hide_from_media_library');
function company_files_hide_from_media_library($query) {
    // Kør kun i admin-panelet og kun på attachment-forespørgsler
    if (!is_admin() || $query->get('post_type') !== 'attachment') {
        return;
    }

    // Tjek om vi er på mediebibliotekets side (upload.php)
    $screen = get_current_screen();
    $is_media_library_page = ($screen && $screen->id === 'upload');

    // Tjek om det er en AJAX-anmodning fra mediebibliotekets gitter-view
    $is_media_library_ajax = (defined('DOING_AJAX') && DOING_AJAX && isset($_REQUEST['action']) && $_REQUEST['action'] === 'query-attachments');

    // Hvis det er en af de to, skal vi modificere forespørgslen
    if ($is_media_library_page || $is_media_library_ajax) {
        $meta_query = $query->get('meta_query') ?: [];
        $meta_query[] = [
            'key'     => 'company_id',
            'compare' => 'NOT EXISTS',
        ];
        $query->set('meta_query', $meta_query);
    }
}

// Hovedfunktion til upload af brugerfiler
function company_handle_upload_fixed($view_user_id = 0, $checked = false) {
    $current_user = wp_get_current_user();
    $user_id = $view_user_id ?: $current_user->ID;

    $company_id = get_user_meta($user_id, 'company_id', true);
    if (!$company_id) return new WP_Error('no_company', 'Din bruger er ikke tilknyttet en virksomhed.', ['status'=>400]);

    if (empty($_FILES['file'])) return new WP_Error('no_file', 'Ingen fil uploadet', ['status'=>400]);

    require_once(ABSPATH.'wp-admin/includes/file.php');
    require_once(ABSPATH.'wp-admin/includes/image.php');

    // Forhindre generering af thumbnails for virksomhedsfiler
    add_filter('intermediate_image_sizes_advanced', function($sizes) {
        return [];
    });

    // Upload folder per virksomhed
    $upload_filter = function($dirs) use ($company_id, $checked) {
        $year = date('Y');
        $month = date('m');
        $custom_subdir = $checked ? "/company-{$company_id}/checked/{$year}/{$month}"
                                   : "/company-{$company_id}/{$year}/{$month}";

        // Eksplicit sæt base-mappen til /wp-content/companies for at undgå tvivl
        $dirs['basedir'] = WP_CONTENT_DIR . '/companies';
        $dirs['baseurl'] = content_url() . '/companies';

        // Opbyg den fulde sti og URL
        $dirs['path']   = $dirs['basedir'] . $custom_subdir;
        $dirs['url']    = $dirs['baseurl'] . $custom_subdir;
        $dirs['subdir'] = $custom_subdir;

        // Opret mappen, hvis den ikke eksisterer
        if (!file_exists($dirs['path'])) wp_mkdir_p($dirs['path']);

        return $dirs;
    };
    add_filter('upload_dir', $upload_filter);

    // Upload fil
    $uploaded = wp_handle_upload($_FILES['file'], ['test_form'=>false]);
    remove_filter('upload_dir', $upload_filter);

    if (isset($uploaded['error'])) return new WP_Error('upload_error', $uploaded['error'], ['status'=>500]);

    // Opret attachment, men "skjul" fra media library
    $attachment_id = wp_insert_attachment([
        'guid'           => $uploaded['url'],
        'post_mime_type' => $uploaded['type'],
        'post_title'     => basename($uploaded['file']),
        'post_status'    => 'private', // gør den privat, skjult i media library
    ], $uploaded['file']);

    $attach_data = wp_generate_attachment_metadata($attachment_id, $uploaded['file']);
    wp_update_attachment_metadata($attachment_id, $attach_data);

    update_post_meta($attachment_id, 'company_id', $company_id);
    update_post_meta($attachment_id, 'uploader_id', $current_user->ID);
    if ($checked) update_post_meta($attachment_id, 'checked_by_admin', 1);

    return [
        'success' => true,
        'file_url' => $uploaded['url'],
        'attachment_id' => $attachment_id
    ];
}

// Shortcode: Upload form + visning af brugerfiler + tjekket dokumentation
add_shortcode('company_upload_form', function() {
    if (!is_user_logged_in()) {
        return '<div class="account-form"><p class="form-message">Log ind for at uploade filer.</p></div>';
    }

    $current_user = wp_get_current_user();
    $view_user_id = $current_user->ID;
    $transient_key = 'company_form_message_' . $current_user->ID;

    // Admin kan skifte bruger-visning
    if (user_can($current_user, 'manage_options') && isset($_GET['view_user'])) {
        $view_user_id = (int) $_GET['view_user'];
    }

    $company_id = get_user_meta($view_user_id, 'company_id', true);
    if (!$company_id) {
        return '<div class="account-form"><p class="form-message">Brugeren har ingen virksomhed tilknyttet.</p></div>';
    }

    $redirect_url = home_url($_SERVER['REQUEST_URI']);

    // Håndter sletning af fil
    if (isset($_POST['delete_file']) && isset($_POST['file_id'])) {
        $file_id = (int) $_POST['file_id'];
        $file_company_id = get_post_meta($file_id, 'company_id', true);
        $uploader_id = get_post_meta($file_id, 'uploader_id', true);
        $message = '';

        if ($file_company_id == $company_id) {
            if (user_can($current_user, 'manage_options') || $current_user->ID == $uploader_id) {
                if (wp_delete_attachment($file_id, true)) {
                    $message = '<p class="success">Filen blev slettet.</p>';
                } else {
                    $message = '<p class="error">Filen kunne ikke slettes.</p>';
                }
            } else {
                $message = '<p class="error">Du har ikke tilladelse til at slette denne fil.</p>';
            }
        } else {
            $message = '<p class="error">Ugyldig anmodning.</p>';
        }
        set_transient($transient_key, $message, 60);
        wp_safe_redirect($redirect_url);
        exit;
    }

    // Håndter upload af brugerfiler
    if (isset($_POST['upload_file']) && !empty($_FILES['file'])) {
        $response = company_handle_upload_fixed($view_user_id, false);
        if (is_wp_error($response)) {
            $message = '<p class="error">'.esc_html($response->get_error_message()).'</p>';
        } else {
            $message = '<p class="success">Filen er uploadet.</p>';
        }
        set_transient($transient_key, $message, 60);
        wp_safe_redirect($redirect_url);
        exit;
    }

    // Håndter admin upload af tjekket dokumentation
    if (isset($_POST['upload_checked_file']) && !empty($_FILES['file']) && user_can($current_user, 'manage_options')) {
        $response = company_handle_upload_fixed($view_user_id, true);
        if (is_wp_error($response)) {
            $message = '<p class="error">'.esc_html($response->get_error_message()).'</p>';
        } else {
            $message = '<p class="success">Filen er uploadet som tjekket dokumentation.</p>';
        }
        set_transient($transient_key, $message, 60);
        wp_safe_redirect($redirect_url);
        exit;
    }
    
    // Hent og slet besked fra transient
    $message = get_transient($transient_key);
    if ($message) {
        delete_transient($transient_key);
    } else {
        $message = '';
    }

    // Hent brugerfiler (ikke tjekket)
    $attachments = get_posts([
        'post_type'   => 'attachment',
        'post_status' => 'private',
        'meta_key'    => 'company_id',
        'meta_value'  => $company_id,
        'meta_query'  => [['key'=>'checked_by_admin','compare'=>'NOT EXISTS']],
        'numberposts' => -1
    ]);

    // Hent tjekket dokumentation
    $checked_attachments = get_posts([
        'post_type'   => 'attachment',
        'post_status' => 'private',
        'meta_key'    => 'company_id',
        'meta_value'  => $company_id,
        'meta_query'  => [['key'=>'checked_by_admin','value'=>1]],
        'numberposts' => -1
    ]);

    ob_start(); 
    
    if ($message) {
        echo '<div class="form-message-wrapper">' . $message . '</div>';
    }
    ?>
    
    <form class="account-form company-upload-form" method="post" enctype="multipart/form-data">
        <h2>Upload filer</h2>
        
        <div class="form-group">
            <input type="file" id="upload-file" name="file" required>
        </div>
        
        <button type="submit" name="upload_file" class="form-submit-btn">Upload</button>
    </form>

    <div class="account-form file-list-section">
        <h3>Dine uploads</h3>
        <ul class="uploaded-files">
            <?php if ($attachments): 
                foreach ($attachments as $file):
                    $owner_id = get_post_meta($file->ID,'uploader_id',true); ?>
                    <li class="file-item">
                        <a href="<?php echo esc_url(wp_get_attachment_url($file->ID)); ?>" target="_blank" class="file-link">
                            <?php echo esc_html($file->post_title); ?>
                        </a>
                        <?php if ($owner_id == $current_user->ID || user_can($current_user,'manage_options')): ?>
                            <form class="delete-file-form" method="post" onsubmit="return confirm('Er du sikker på, at du vil slette denne fil?');">
                                <input type="hidden" name="file_id" value="<?php echo esc_attr($file->ID); ?>">
                                <button type="submit" name="delete_file" class="delete-btn">Slet</button>
                            </form>
                        <?php endif; ?>
                    </li>
                <?php endforeach;
            else: ?>
                <li class="no-files">Ingen uploads endnu.</li>
            <?php endif; ?>
        </ul>
    </div>

    <div class="account-form file-list-section">
        <h3>Tjekket dokumentation</h3>
        <ul class="uploaded-files">
            <?php if ($checked_attachments): 
                foreach ($checked_attachments as $file): ?>
                    <li class="file-item">
                        <a href="<?php echo esc_url(wp_get_attachment_url($file->ID)); ?>" target="_blank" class="file-link">
                            <?php echo esc_html($file->post_title); ?>
                        </a>
                        <?php if (user_can($current_user,'manage_options')): ?>
                            <form class="delete-file-form" method="post" onsubmit="return confirm('Er du sikker på, at du vil slette denne fil?');">
                                <input type="hidden" name="file_id" value="<?php echo esc_attr($file->ID); ?>">
                                <button type="submit" name="delete_file" class="delete-btn">Slet</button>
                            </form>
                        <?php endif; ?>
                    </li>
                <?php endforeach;
            else: ?>
                <li class="no-files">Ingen dokumenter er blevet tjekket endnu.</li>
            <?php endif; ?>
        </ul>
    </div>

    <?php if (user_can($current_user,'manage_options')): ?>
        <form class="account-form admin-checked-upload" method="post" enctype="multipart/form-data">
            <h2>Upload Tjekket Dokumentation</h2>
            
            <div class="form-group">
                <input type="file" id="checked-file" name="file" required>
            </div>
            
            <button type="submit" name="upload_checked_file" class="form-submit-btn">Upload Tjekket Dokument</button>
        </form>
    <?php endif;

    return ob_get_clean();
});

// ============================================================================
// ESG SYSTEM
// ============================================================================

// REST API Endpoints for ESG data
add_action('rest_api_init', function () {
    register_rest_route('esg/v1', '/data/(?P<id>\d+)', [
        'methods' => ['GET','POST'],
        'callback' => function($request) {
            $user_id = isset($request['id']) ? (int)$request['id'] : 0;
            if (!$user_id) return new WP_Error('no_user', 'Ingen bruger angivet', ['status' => 400]);

            // Håndter GET-anmodninger som før
            if ($request->get_method() === 'GET') {
                $data = get_user_meta($user_id, 'esg_data', true);
                return new WP_REST_Response($data ?: [], 200);
            } 
            
            // Håndter POST-anmodninger
            if ($request->get_method() === 'POST') {
                $content_type = $request->get_header('content-type');

                // Hvis det er almindelige JSON-data (dvaAnswers, etc.)
                if ($content_type && strpos($content_type, 'application/json') !== false) {
                    $new_data_from_request = $request->get_json_params();
                    if (!is_array($new_data_from_request)) $new_data_from_request = [];

                    $existing_esg_data = get_user_meta($user_id, 'esg_data', true);
                    if (!is_array($existing_esg_data)) $existing_esg_data = [];
                    
                    // Merge existing data with new data. New data (answers) take precedence.
                    // Other existing fields like 'polarChartImage' are preserved if not overwritten by new_data_from_request.
                    $updated_esg_data = array_merge($existing_esg_data, $new_data_from_request);

                    update_user_meta($user_id, 'esg_data', $updated_esg_data);
                    return new WP_REST_Response(['status' => 'success', 'message' => 'Data gemt.'], 200);

                // Hvis det er billed-data (sendt som 'text/plain')
                } else if ($content_type && strpos($content_type, 'text/plain') !== false) {
                    $image_base64 = $request->get_body();
                    if (empty($image_base64)) {
                        return new WP_Error('no_image', 'Intet billede modtaget.', ['status' => 400]);
                    }

                    $existing_data = get_user_meta($user_id, 'esg_data', true);
                    if (!is_array($existing_data)) {
                        $existing_data = [];
                    }
                    
                    $updated_data = array_merge($existing_data, ['polarChartImage' => $image_base64]);
                    update_user_meta($user_id, 'esg_data', $updated_data);

                    return new WP_REST_Response(['status' => 'success', 'message' => 'Billede gemt.'], 200);
                
                // Fallback for andre uventede content types
                } else {
                    return new WP_Error('bad_content_type', 'Ugyldig eller manglende Content-Type. Fik: ' . $content_type, ['status' => 400]);
                }
            }
        },
        'permission_callback' => function($request) {
            $current_user_id = get_current_user_id();
            return $current_user_id === (int)$request['id'] || user_can($current_user_id, 'manage_options');
        }
    ]);
});

// ESG user chart shortcode
add_shortcode('esg_user_chart', function() {
    if (!is_user_logged_in()) {
        return '<p>Log venligst ind for at se dit dashboard.</p>';
    }

    $current_user = wp_get_current_user();
    $view_user_id = $current_user->ID;

    // Admin kan se en anden bruger
    if (user_can($current_user, 'manage_options') && isset($_GET['view_user'])) {
        $view_user_id = (int) $_GET['view_user'];
    }

    // Hent alt esg_data for brugeren
    $esg_data = get_user_meta($view_user_id, 'esg_data', true);


    // Hent billedet, hvis det findes
    $image_base64 = $esg_data['polarChartImage'] ?? '';

    // --- DEBUGGING START ---
    $debug_html = '';
    $debug_html .= '<p>DEBUG: Type of $image_base64: ' . gettype($image_base64) . '</p>';
    if (is_string($image_base64)) {
        $debug_html .= '<p>DEBUG: Length of $image_base64: ' . strlen($image_base64) . '</p>';
        $debug_html .= '<p>DEBUG: First 50 chars of $image_base64: ' . substr($image_base64, 0, 50) . '</p>';
    } else {
        $debug_html .= '<pre>DEBUG: $image_base64 content: ' . print_r($image_base64, true) . '</pre>';
    }
    // --- DEBUGGING END ---

    // Remove the data URI prefix if it exists, as the shortcode adds it
    $image_base64 = str_replace('data:image/png;base64,', '', $image_base64);

    if (!empty($image_base64) && is_string($image_base64)) {
        $img_html = '<h3>ESG Performance Graf</h3>
                     <img src="data:image/png;base64,' . $image_base64 . '" alt="ESG Performance Graf" style="max-width:100%; height:auto; border-radius:8px;" />';
    } else {
        $img_html = '<p>Udfyld beregneren for at se din performance her.</p>';
    }

    return $debug_html . $img_html;
});




// ESG React app mount point
if (!shortcode_exists('esg_app')) {
    add_shortcode('esg_app', function() {
        return '<div id="esg-root" class="esg-app-container"></div>';
    });
}

// Load ESG React app assets
function load_esg_react_app_assets() {
    if (is_singular() && has_shortcode(get_post()->post_content, 'esg_app')) {
        $plugin_dir_path = plugin_dir_path(__FILE__);
        $plugin_dir_url  = plugin_dir_url(__FILE__);

        // CSS
        $css_files = glob($plugin_dir_path . 'build/static/css/main*.css');
        if (!empty($css_files)) {
            $css_file_name = basename($css_files[0]);
            wp_enqueue_style(
                'esg-app-style',
                $plugin_dir_url . 'build/static/css/' . $css_file_name,
                [],
                filemtime($plugin_dir_path . 'build/static/css/' . $css_file_name)
            );
        }

        // JS
        $js_files = glob($plugin_dir_path . 'build/static/js/main*.js');
        if (!empty($js_files)) {
            $js_file_name = basename($js_files[0]);
            $script_handle = 'esg-app-script';
            wp_enqueue_script(
                $script_handle,
                $plugin_dir_url . 'build/static/js/' . $js_file_name,
                [],
                filemtime($plugin_dir_path . 'build/static/js/' . $js_file_name),
                true
            );

            // Determine the correct user ID to pass to the React app
            $current_user_id = get_current_user_id();
            $target_user_id = $current_user_id;
            if (user_can($current_user_id, 'manage_options') && isset($_GET['view_user'])) {
                $target_user_id = (int) $_GET['view_user'];
            }

            $config_data = [
                'userId' => $target_user_id,
                'nonce'  => wp_create_nonce('wp_rest'),
                'apiUrl' => rest_url('esg/v1/'),
            ];

            wp_add_inline_script($script_handle, sprintf('window.esgConfig = %s;', wp_json_encode($config_data)), 'before');
        }
    }
}
add_action('wp_enqueue_scripts', 'load_esg_react_app_assets', 20);

// ============================================================================
// ENQUEUE ASSETS
// ============================================================================

// Enqueue upload JavaScript
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'company-upload-js',
        'https://esgscore.dk/wp-content/mu-plugins/js/company-upload.js',
        [],
        null,
        true
    );

    $upload_data = [
        'upload_url' => esc_url_raw(rest_url('company/v1/upload')),
        'nonce' => wp_create_nonce('wp_rest'),
    ];

    wp_add_inline_script('company-upload-js', 'window.company_upload = ' . wp_json_encode($upload_data) . ';');
});

// Enqueue register form CSS
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'esg-register-form',
        'https://esgscore.dk/wp-content/mu-plugins/esg-register-form.css',
        [],
        '1.0'
    );
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Rolle / adgangskontrol helper
function company_can_access_paid_area() {
    $user = wp_get_current_user();
    return in_array('administrator', $user->roles) || in_array('premium', $user->roles);
}

// ============================================================================
// Master Shortcode
// ============================================================================

add_action('init', function () {
    add_shortcode('account_page', function () {

        ob_start();

        $current_user = wp_get_current_user();
        $is_logged_in = is_user_logged_in();

        $login_error = get_transient('company_login_error');
        if ($login_error) delete_transient('company_login_error');
        ?>

        <div class="esg-account">

        <?php if ($is_logged_in): ?>

            <div class="dashboard-wrapper account-container">

                <div class="account-left">
                    <div class="account-sidebar">
                        <h3>Velkommen, <?php echo esc_html($current_user->first_name); ?>!</h3>
                        <?php echo do_shortcode('[user_profile_editor]'); ?>
                    </div>
                </div>

                <div class="account-right">

                    <section class="dashboard-esg file-list-section">
                        <?php echo do_shortcode('[esg_user_chart]'); ?>
                    </section>

                    <section class="dashboard-upload file-list-section">
                        <h3>Upload Filer</h3>
                        <?php echo do_shortcode('[company_upload_form]'); ?>
                    </section>

                </div>

            </div>

        <?php else: ?>

            <div class="account-auth-wrapper">

                <?php if ($login_error): ?>
                    <p class="form-message error"><?php echo esc_html($login_error); ?></p>
                <?php endif; ?>

                <div class="auth-panel active" id="auth-login">
                    <form method="post" class="account-form">
                        <h2>Log ind</h2>
                        <div class="form-group">
                            <label for="log">Brugernavn eller e-mail</label>
                            <input type="text" id="log" name="log" required>
                        </div>
                        <div class="form-group">
                            <label for="pwd">Adgangskode</label>
                            <input type="password" id="pwd" name="pwd" required>
                        </div>
                        <button type="submit" name="company_login" class="form-submit-btn">Log ind</button>
                        <p class="auth-switch-link">
                            Har du ikke en konto?
                            <span class="auth-switch-btn" data-switch="register">Opret virksomhedskonto</span>
                        </p>
                    </form>
                </div>

                <div class="auth-panel" id="auth-register">
                    <form method="post" class="account-form esg-register-form">
                        <h2>Opret virksomhedskonto</h2>
                        <?php /* resten uændret */ ?>
                    </form>
                </div>

            </div>

        <?php endif; ?>

        </div>

        <?php
        return ob_get_clean();
    });
}, 999);

