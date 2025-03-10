<div id="header">
	<?php echo $home->and($home->children)->implode(" / ", "<a href='{url}'>{title}</a>"); ?>
</div>

<aside id="aside"></aside>

<h1 id="headline">
	<?php if($page->parents->count()): // breadcrumbs ?>
		<?php echo $page->parents->implode(" &gt; ", "<a href='{url}'>{title}</a>"); ?> &gt;
	<?php endif; ?>
	<?php echo $page->title; // headline ?>
</h1>

<div id="content">
	Default content
</div>

<?php if($page->editable()): ?>
<p><a href='<?php echo $page->editUrl(); ?>'>Edit this page</a></p>
<?php endif; ?>
