<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$superAdmin = App\Models\User::where('role', 'super-admin')->first();
$tenant = App\Models\Tenant::first();

$req = Illuminate\Http\Request::create('/admin/tenants/' . $tenant->id . '/edit', 'GET');
$session = $app['session.store'];
$req->setLaravelSession($session);
$req->setUserResolver(function() use ($superAdmin) { return $superAdmin; });
Illuminate\Support\Facades\Auth::login($superAdmin);

$controller = new App\Http\Controllers\Admin\TenantController();
$res = $controller->edit($tenant);
$data = $res->toResponse($req)->original->getData();
echo "Component: " . $data['page']['component'] . "\n";
echo "Tenant: " . json_encode($data['page']['props']['tenant']['name']) . "\n";
echo "AdminUser: " . json_encode($data['page']['props']['adminUser'] ? $data['page']['props']['adminUser']['email'] : 'null') . "\n";
